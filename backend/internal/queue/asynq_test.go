package queue

import "testing"

func TestParseRedisURLConfiguresTLSForRediss(t *testing.T) {
	opt, err := ParseRedisURL("rediss://default:secret@cache.example.com:6380/2")
	if err != nil {
		t.Fatalf("ParseRedisURL returned an error: %v", err)
	}

	if opt.Addr != "cache.example.com:6380" || opt.Username != "default" || opt.Password != "secret" || opt.DB != 2 {
		t.Fatalf("unexpected Redis options: %#v", opt)
	}
	if opt.TLSConfig == nil || opt.TLSConfig.ServerName != "cache.example.com" {
		t.Fatalf("expected TLS configuration for rediss URL")
	}
}

func TestParseRedisURLRejectsInvalidURLs(t *testing.T) {
	for _, rawURL := range []string{
		"http://cache.example.com",
		"redis:///0",
		"redis://cache.example.com/not-a-number",
	} {
		if _, err := ParseRedisURL(rawURL); err == nil {
			t.Errorf("expected an error for %q", rawURL)
		}
	}
}
