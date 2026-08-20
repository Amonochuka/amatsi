/*
 * ============================================================================
 * internal/services/alert_service.go — ALERT / SMS BUSINESS LOGIC
 * Component: Person B + <Database / Repos / Clients / SMS logic>
 *
 * Domain rules around SMS: template rendering, opt-out enforcement,
 * enqueueing, and history status logic that handlers and the worker share.
 *
 * WHAT NEEDS TO BE DONE:
 * - RenderMessage(template, data, language): produce the SMS body using the
 *   English / Kiswahili / Luo templates (Features 13.2–13.5), e.g.
 *   "Don't irrigate today. 78% rain expected. Save 450L." (+ Swahili/Luo).
 * - EnqueueAlert(ctx, farmer, farm, recipients): enforce sms_enabled
 *   (Feature 13.9), create the sms_log (status pending, 13.8) via
 *   alert_repository, and push a SendSMSTask via Asynq (13.1, 13.6).
 * - GetFarmerHistory(ctx, farmerID): delegate to alert_repository for the
 *   Alerts History page (Feature 13.7).
 * - Apply opt-out when Africa's Talking reports STOP (Feature 13.9).
 * - Keep Primary Phone (13.14) as the default single recipient when the
 *   farmer has not added multiple phones.
 *
 * Feature references: 13.1, 13.2–13.5, 13.6, 13.7, 13.8, 13.9, 13.14.
 * ============================================================================
 */
package services
