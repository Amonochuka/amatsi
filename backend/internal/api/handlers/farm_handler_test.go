package handlers

import "testing"

func TestNormalizedDeviceID(t *testing.T) {
	if got := normalizedDeviceID(nil); got != nil {
		t.Fatalf("expected nil device ID, got %q", *got)
	}

	blank := "   "
	if got := normalizedDeviceID(&blank); got != nil {
		t.Fatalf("expected blank device ID to be cleared, got %q", *got)
	}

	deviceID := "  ESP32-Kijani-001  "
	got := normalizedDeviceID(&deviceID)
	if got == nil || *got != "ESP32-Kijani-001" {
		t.Fatalf("expected normalized device ID, got %#v", got)
	}
}
