/*
 * ============================================================================
 * internal/api/handlers/auth_handler.go — AUTH HANDLERS
 * Component: Person A + <Go API / Team Lead>
 *
 * Login / Signup / Logout request handling: validates input, hashes and
 * verifies passwords with bcrypt, and issues/revokes JWTs (Feature 19.10).
 *
 * WHAT NEEDS TO BE DONE:
 * - SignupHandler: validate name/phone/password, check sms_enabled default,
 *   bcrypt-hash the password, insert into farmers table, return farmer + JWT.
 * - LoginHandler: look up farmer by phone, bcrypt-compare password, issue a
 *   signed JWT containing the farmer ID, return token + farmer.
 * - LogoutHandler: since tokens are stateless, either client discards or
 *   implement a Redis/JWT allowlist or short-lived expiry; at minimum return
 *   a clean success response (Feature 19.10 + docs/to-do-list.md).
 * - Return consistent structured error JSON (wrong credentials = 401,
 *   duplicate phone = 409, validation = 400) (Feature 19.7).
 * - Never log or return passwords/hashes.
 *
 * Feature references: 19.10, 19.7.
 * ============================================================================
 */
package handlers
