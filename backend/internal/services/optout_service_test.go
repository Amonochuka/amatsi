package services

import "testing"

func TestInboundInstructionRecognizesOptOut(t *testing.T) {
	for _, msg := range []string{
		"STOP",
		"stop",
		"Stop sending these messages",
		"STOPALL",
		"CANCEL",
		"END",
		"QUIT",
		"UNSUBSCRIBE",
		"Acha",
	} {
		if got := inboundInstruction(msg); got != "stop" {
			t.Errorf("inboundInstruction(%q) = %q, want stop", msg, got)
		}
	}
}

func TestInboundInstructionRecognizesOptIn(t *testing.T) {
	for _, msg := range []string{
		"START",
		"start",
		"YES",
		"BEGIN",
		"UNSTOP",
		"Anza",
	} {
		if got := inboundInstruction(msg); got != "start" {
			t.Errorf("inboundInstruction(%q) = %q, want start", msg, got)
		}
	}
}

func TestInboundInstructionIgnoresOtherMessages(t *testing.T) {
	for _, msg := range []string{
		"",
		"   ",
		"Hello",
		"Where is my farm?",
		"MTUNA", // not a keyword
		"stops", // prefix match is not enough; must be the first word exactly
	} {
		if got := inboundInstruction(msg); got != "" {
			t.Errorf("inboundInstruction(%q) = %q, want empty", msg, got)
		}
	}
}

func TestPhoneDigitsRegexpStripsFormatting(t *testing.T) {
	cases := map[string]string{
		"+254 700 000 000": "254700000000",
		"2547-0000-0000":   "254700000000",
		"0700000000":       "0700000000",
		"07 0000 0000":     "0700000000",
	}
	for in, want := range cases {
		if got := phoneDigitsRegexp.ReplaceAllString(in, ""); got != want {
			t.Errorf("normalize(%q) = %q, want %q", in, got, want)
		}
	}
}
