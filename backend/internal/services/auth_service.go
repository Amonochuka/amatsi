/*
 * ============================================================================
 * internal/services/auth_service.go — AUTH SERVICE
 *
 * Encapsulates the security-critical flows: registration, login, refresh-token
 * rotation, logout (revocation), profile updates and password changes. Token
 * issuance and Redis blacklisting live here rather than in the HTTP handler so
 * they can be unit-tested without a Gin context.
 * ============================================================================
 */

package services

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/redis/go-redis/v9"
	"golang.org/x/crypto/bcrypt"

	"github.com/amatsi/backend/internal/auth"
	"github.com/amatsi/backend/internal/models"
	"github.com/amatsi/backend/internal/repository"
)

// TokenPair is a short-lived access token plus its rotating refresh token.
type TokenPair struct {
	AccessToken  string
	RefreshToken string
}

// SignupProfile carries the validated registration inputs into the service.
type SignupProfile struct {
	FullName    string
	PhoneNumber string
	Email       string
	Language    string
	SMSEnabled  bool
}

// ProfileChanges carries optional profile fields; nil means "leave unchanged".
type ProfileChanges struct {
	FullName    *string
	PhoneNumber *string
	Email       *string
	Language    *string
	SMSEnabled  *bool
}

// AuthService manages accounts and sessions.
type AuthService struct {
	userRepo   *repository.UserRepository
	rdb        *redis.Client
	jwtSecret  string
	accessTTL  time.Duration
	refreshTTL time.Duration
}

func NewAuthService(
	userRepo *repository.UserRepository,
	rdb *redis.Client,
	jwtSecret string,
	accessTTL, refreshTTL time.Duration,
) *AuthService {
	return &AuthService{
		userRepo:   userRepo,
		rdb:        rdb,
		jwtSecret:  jwtSecret,
		accessTTL:  accessTTL,
		refreshTTL: refreshTTL,
	}
}

// Signup creates an account and returns the new user with a fresh token pair.
// A phone number already on file maps to ErrPhoneInUse.
func (s *AuthService) Signup(ctx context.Context, profile SignupProfile, password string) (*models.User, TokenPair, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, TokenPair{}, err
	}

	user := &models.User{
		ID:           uuid.NewString(),
		FullName:     profile.FullName,
		PhoneNumber:  profile.PhoneNumber,
		Email:        profile.Email,
		PasswordHash: string(hash),
		Language:     profile.Language,
		SMSEnabled:   profile.SMSEnabled,
	}

	if existing, err := s.userRepo.GetUserByPhone(ctx, user.PhoneNumber); err == nil && existing != nil {
		return nil, TokenPair{}, ErrPhoneInUse
	} else if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		return nil, TokenPair{}, err
	}

	if err := s.userRepo.CreateUser(ctx, user); err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "duplicate") || strings.Contains(err.Error(), "unique") {
			return nil, TokenPair{}, ErrPhoneInUse
		}
		return nil, TokenPair{}, err
	}

	pair, err := s.issueTokenPair(user.ID)
	if err != nil {
		return nil, TokenPair{}, err
	}
	return user, pair, nil
}

// Login verifies phone + password and returns the user with a fresh token pair.
// Both unknown accounts and bad passwords map to ErrInvalidCredentials so the
// endpoint does not reveal which one was wrong.
func (s *AuthService) Login(ctx context.Context, phoneNumber, password string) (*models.User, TokenPair, error) {
	user, err := s.userRepo.GetUserByPhone(ctx, phoneNumber)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, TokenPair{}, ErrInvalidCredentials
		}
		return nil, TokenPair{}, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, TokenPair{}, ErrInvalidCredentials
	}

	pair, err := s.issueTokenPair(user.ID)
	if err != nil {
		return nil, TokenPair{}, err
	}
	return user, pair, nil
}

// Refresh exchanges a valid, non-revoked refresh token for a new pair, rotating
// the refresh token: the presented one is blacklisted so it cannot be replayed.
func (s *AuthService) Refresh(ctx context.Context, refreshToken string) (TokenPair, error) {
	if strings.TrimSpace(refreshToken) == "" {
		return TokenPair{}, ErrRefreshTokenRequired
	}

	claims, jti, expiresAt, err := s.ValidateRefreshToken(ctx, refreshToken)
	if err != nil {
		return TokenPair{}, err
	}

	userID, _ := claims["sub"].(string)

	// Rotation: kill the presented refresh token before issuing its successor.
	if err := auth.Revoke(ctx, s.rdb, jti, auth.TokenTypeRefresh, expiresAt); err != nil {
		return TokenPair{}, ErrInvalidToken
	}

	return s.issueTokenPair(userID)
}

// Logout revokes the current access token, and — when the client still holds a
// refresh token — that too, so the whole session dies rather than just the
// short-lived access token. Refresh-token revocation is best-effort.
func (s *AuthService) Logout(ctx context.Context, accessJTI string, accessExp time.Time, refreshToken string) error {
	if accessJTI != "" && !accessExp.IsZero() {
		if err := auth.Revoke(ctx, s.rdb, accessJTI, auth.TokenTypeAccess, accessExp); err != nil {
			return err
		}
	}

	if strings.TrimSpace(refreshToken) != "" {
		if claims, jti, expiresAt, err := s.ValidateRefreshToken(ctx, refreshToken); err == nil {
			_ = auth.Revoke(ctx, s.rdb, jti, auth.TokenTypeRefresh, expiresAt)
			_ = claims
		}
	}
	return nil
}

// UpdateProfile applies the provided profile changes and returns the saved user.
func (s *AuthService) UpdateProfile(ctx context.Context, userID string, changes ProfileChanges) (*models.User, error) {
	user, err := s.userRepo.GetUserByID(ctx, userID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrAccountNotFound
		}
		return nil, err
	}

	if changes.FullName != nil {
		user.FullName = strings.TrimSpace(*changes.FullName)
	}
	if changes.PhoneNumber != nil {
		newPhone := strings.TrimSpace(*changes.PhoneNumber)
		if newPhone != user.PhoneNumber {
			if existing, err := s.userRepo.GetUserByPhone(ctx, newPhone); err == nil && existing != nil {
				return nil, ErrPhoneInUse
			} else if err != nil && !errors.Is(err, pgx.ErrNoRows) {
				return nil, err
			}
			user.PhoneNumber = newPhone
		}
	}
	if changes.Email != nil {
		user.Email = strings.TrimSpace(*changes.Email)
	}
	if changes.Language != nil {
		user.Language = *changes.Language
	}
	if changes.SMSEnabled != nil {
		user.SMSEnabled = *changes.SMSEnabled
	}

	if err := s.userRepo.UpdateUserProfile(ctx, user); err != nil {
		return nil, err
	}
	return user, nil
}

// ChangePassword verifies the current password before setting a new one.
func (s *AuthService) ChangePassword(ctx context.Context, userID, currentPassword, newPassword string) error {
	user, err := s.userRepo.GetUserByID(ctx, userID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrAccountNotFound
		}
		return err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(currentPassword)); err != nil {
		return ErrCurrentPasswordWrong
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	return s.userRepo.UpdatePasswordHash(ctx, userID, string(hash))
}

// ValidateRefreshToken parses a refresh token and ensures it is signed, is a
// refresh token (not an access token) and has not been revoked.
func (s *AuthService) ValidateRefreshToken(ctx context.Context, tokenString string) (jwt.MapClaims, string, time.Time, error) {
	claims, err := auth.Parse(tokenString, s.jwtSecret)
	if err != nil {
		return nil, "", time.Time{}, ErrInvalidToken
	}

	if tokType, ok := claims["typ"].(string); !ok || tokType != auth.TokenTypeRefresh {
		return nil, "", time.Time{}, ErrInvalidToken
	}

	jti, ok := claims["jti"].(string)
	if !ok || jti == "" {
		return nil, "", time.Time{}, ErrInvalidToken
	}
	expiresAtUnix, ok := claims["exp"].(float64)
	if !ok {
		return nil, "", time.Time{}, ErrInvalidToken
	}
	expiresAt := time.Unix(int64(expiresAtUnix), 0)

	revoked, err := auth.IsRevoked(ctx, s.rdb, jti)
	if err != nil {
		return nil, "", time.Time{}, ErrInvalidToken
	}
	if revoked {
		return nil, "", time.Time{}, ErrRevokedToken
	}

	return claims, jti, expiresAt, nil
}

func (s *AuthService) issueAccessToken(userID string) (string, error) {
	return s.issueSigned(userID, auth.TokenTypeAccess, s.accessTTL)
}

func (s *AuthService) issueRefreshToken(userID string) (string, error) {
	return s.issueSigned(userID, auth.TokenTypeRefresh, s.refreshTTL)
}

func (s *AuthService) issueSigned(userID, tokenType string, ttl time.Duration) (string, error) {
	now := time.Now()
	claims := jwt.MapClaims{
		"sub": userID,
		"jti": uuid.NewString(),
		"typ": tokenType,
		"exp": now.Add(ttl).Unix(),
		"iat": now.Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}

func (s *AuthService) issueTokenPair(userID string) (TokenPair, error) {
	access, err := s.issueAccessToken(userID)
	if err != nil {
		return TokenPair{}, err
	}
	refresh, err := s.issueRefreshToken(userID)
	if err != nil {
		return TokenPair{}, err
	}
	return TokenPair{AccessToken: access, RefreshToken: refresh}, nil
}