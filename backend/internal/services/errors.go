package services

import "errors"

// Sentinel errors shared across the service layer. Handlers map these to HTTP
// status codes instead of parsing free-form strings.
var (
	ErrAccountNotFound       = errors.New("account not found")
	ErrPhoneInUse            = errors.New("phone number already registered")
	ErrInvalidCredentials    = errors.New("invalid credentials")
	ErrCurrentPasswordWrong  = errors.New("current password is incorrect")
	ErrInvalidToken          = errors.New("invalid or expired token")
	ErrRevokedToken          = errors.New("token has been revoked")
	ErrRefreshTokenRequired  = errors.New("refresh_token is required")
	ErrFarmNotFound          = errors.New("farm not found")
	ErrSMSDisabled           = errors.New("sms alerts disabled for this account")
	ErrUpstreamUnavailable   = errors.New("upstream unavailable")
	ErrPhoneAlreadyAdded     = errors.New("phone number already added for this account")
)