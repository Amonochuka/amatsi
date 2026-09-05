package services

import (
	"context"
	"log/slog"
	"regexp"
	"strings"

	"github.com/amatsi/backend/internal/repository"
)

// phoneDigitsRegexp strips everything except digits from a phone number so
// numbers with different formatting (+, spaces, dashes, country codes) compare
// equal for inbound SMS matching.
var phoneDigitsRegexp = regexp.MustCompile(`[^0-9]`)

// optOutKeywords are the first-word instructions that turn SMS alerts off. The
// list covers the standard CTIA shortcode keywords plus "ACHA" (Kiswahili).
var optOutKeywords = []string{"STOP", "STOPALL", "CANCEL", "END", "QUIT", "UNSUBSCRIBE", "ACHA"}

// optInKeywords re-enable alerts that were disabled by a STOP reply.
var optInKeywords = []string{"START", "UNSTOP", "BEGIN", "YES", "ANZA"}

// OptOutService processes inbound SMS replies from Africa's Talking. When a
// recipient replies STOP the carrier-level opt-out is handled automatically by
// Africa's Talking; this service mirrors that state in our own database so the
// UI and future sends reflect it.
type OptOutService struct {
	userRepo  *repository.UserRepository
	phoneRepo *repository.PhoneRepository
}

func NewOptOutService(userRepo *repository.UserRepository, phoneRepo *repository.PhoneRepository) *OptOutService {
	return &OptOutService{
		userRepo:  userRepo,
		phoneRepo: phoneRepo,
	}
}

// OptOutResult describes what HandleInbound did.
type OptOutResult struct {
	From          string `json:"from"`
	Action        string `json:"action"` // "start", "stop", or ""
	Account       bool   `json:"account_updated"`
	PhonesUpdated int    `json:"phones_updated"`
}

// HandleInbound applies an inbound SMS reply:
//
//   - "STOP" (or CANCEL/END/QUIT/UNSUBSCRIBE/ACHA): disable the account's SMS
//     alerts if the replying number is the primary phone, and opt out every
//     matching user_phones recipient.
//   - "START" (or YES/BEGIN/UNSTOP/ANZA): reverse both effects.
//
// Any other message is ignored.
func (s *OptOutService) HandleInbound(ctx context.Context, from, text string) OptOutResult {
	result := OptOutResult{From: strings.TrimSpace(from), Action: inboundInstruction(text)}
	if result.Action == "" || result.From == "" {
		return result
	}

	key := contextKey(result.Action)
	accountOptedOut := result.Action == "stop"
	digits := phoneDigitsRegexp.ReplaceAllString(result.From, "")

	if user, err := s.userRepo.FindUserByDialPhone(ctx, digits); err == nil && user != nil {
		if err := s.userRepo.SetSMSEnabled(ctx, user.ID, !accountOptedOut); err != nil {
			slog.Error("failed to update sms_enabled from inbound reply",
				slog.String("user_id", user.ID),
				slog.String("error", err.Error()))
		} else {
			result.Account = true
			slog.Info("sms_enabled updated from inbound reply",
				slog.String("user_id", user.ID),
				slog.Bool("sms_enabled", !accountOptedOut),
				slog.String("keyword", key))
		}
	}

	phones, err := s.phoneRepo.FindByDialPhone(ctx, digits)
	if err != nil {
		slog.Error("failed to look up recipients for inbound reply",
			slog.String("error", err.Error()))
		return result
	}
	for _, ph := range phones {
		if err := s.phoneRepo.SetOptedOut(ctx, ph.ID, accountOptedOut); err != nil {
			slog.Error("failed to update recipient opt-out state",
				slog.String("phone_id", ph.ID),
				slog.String("error", err.Error()))
			continue
		}
		result.PhonesUpdated++
	}
	return result
}

func contextKey(action string) string {
	if action == "start" {
		return "OPT-IN"
	}
	return "OPT-OUT"
}

// inboundInstruction classifies the first word of an inbound message as
// "stop", "start", or "" when it does not match any known keyword.
func inboundInstruction(text string) string {
	fields := strings.Fields(strings.ToUpper(strings.TrimSpace(text)))
	if len(fields) == 0 {
		return ""
	}
	first := fields[0]
	for _, kw := range optOutKeywords {
		if first == kw {
			return "stop"
		}
	}
	for _, kw := range optInKeywords {
		if first == kw {
			return "start"
		}
	}
	return ""
}
