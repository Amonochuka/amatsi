/*
 * ============================================================================
 * internal/clients/africastalking.go — AFRICA'S TALKING SMS CLIENT
 * Component: Person B + <Database / Repos / Clients / SMS logic>
 *
 * Bridges the Go API to Africa's Talking. All SMS traffic (Feature 13.x)
 * flows through here: formatting, sending, and delivery-status handling.
 *
 * WHAT NEEDS TO BE DONE:
 * - Define AfricaTalkingClient struct with apiKey, username, senderID,
 *   callbackURL and an http.Client with timeout.
 * - Implement NewAfricaTalkingClient(apiKey, username, senderID).
 * - Implement SendSMS(ctx, phone, message), including:
 *   - Phone formatting/normalisation to international E.164 (+2547...)
 *     supporting Multi-Phone (Feature 13.6) = send to a []string).
 *   - Optional retry loop with backoff on failure (Feature 13.8).
 * - Implement delivery-status parsing from the callback URL (delivered /
 *   pending / failed) so sms_logs can be updated (Feature 13.8).
 * - Add a GetCreditBalance() helper so the UI can show the remaining
 *   SMS credit balance (Feature 13.15).
 * - Respect opt-out: refuse to send to farmers whose sms_enabled=false
 *   (Feature 13.9).
 *
 * Feature references: 13.1, 13.6, 13.8, 13.9, 13.15.
 * ============================================================================
 */
package clients
