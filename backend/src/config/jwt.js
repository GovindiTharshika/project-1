/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1
 * Module: backend/src/config/jwt.js
 * Description: RFC 7519 Compliant JSON Web Token (JWT) Engine (HMAC-SHA256)
 * Built with native Node.js crypto module for zero-dependency high reliability.
 * ============================================================================
 */

// Import the native cryptographic module from Node.js standard library
const crypto = require('crypto');

// Secret cryptographic key used to sign and verify HMAC-SHA256 tokens
// Reads from the environment variable JWT_SECRET, or defaults to a secure fallback key
const JWT_SECRET = process.env.JWT_SECRET || 'arrowstack_super_secret_jwt_key_2024_b2b_orderhub';

// Standard token lifetime duration in hours (24 hours standard for B2B sessions)
const DEFAULT_EXPIRY_HOURS = 24;

/**
 * Encodes a UTF-8 string into a URL-safe Base64 string according to RFC 7519
 * @param {string} str - Raw string or stringified JSON to encode
 * @returns {string} Base64URL encoded representation
 */
function base64UrlEncode(str) {
  // Convert string to base64 buffer, strip '=' padding, replace '+' with '-' and '/' with '_'
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Decodes a URL-safe Base64 string back into a standard UTF-8 string
 * @param {string} str - Base64URL encoded string
 * @returns {string} Decoded UTF-8 plain text string
 */
function base64UrlDecode(str) {
  // Revert URL-safe characters back to standard Base64 characters
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  // Pad with '=' to make length a multiple of 4
  while (str.length % 4) {
    str += '=';
  }
  // Decode Base64 buffer back to UTF-8
  return Buffer.from(str, 'base64').toString('utf8');
}

/**
 * Creates and cryptographically signs a JSON Web Token (JWT) using HMAC-SHA256
 * @param {object} payload - Custom claims (user id, email, role, company)
 * @param {object} options - Optional configuration (e.g., custom expiry)
 * @returns {string} The full three-part JWT token (header.payload.signature)
 */
function sign(payload, options = {}) {
  // Define standard JWT header specifying algorithm HS256 and type JWT
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  // Calculate expiration timestamp (in seconds since UNIX epoch)
  const expHours = options.expiresInHours || DEFAULT_EXPIRY_HOURS;
  const exp = Math.floor(Date.now() / 1000) + (expHours * 3600);

  // Combine custom payload with standard issued-at (iat) and expiration (exp) claims
  const fullPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp
  };

  // Base64URL encode header and payload segments
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  // Compute HMAC-SHA256 signature using the secret key over "header.payload"
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  // Concatenate three dot-separated components into final RFC 7519 JWT
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verifies the cryptographic signature and expiration of an incoming JWT token
 * @param {string} token - The raw dot-separated JWT token string
 * @returns {object} The decoded payload claims if valid
 * @throws {Error} If token format, signature, or expiration check fails
 */
function verify(token) {
  // Validate that token string is provided
  if (!token || typeof token !== 'string') {
    throw new Error('Token is required');
  }

  // Split the token into its three constituents: [header, payload, signature]
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT token format');
  }

  const [encodedHeader, encodedPayload, signature] = parts;

  // Recompute expected HMAC-SHA256 signature using the server secret key
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  // Verify that the received signature strictly matches the computed signature
  if (signature !== expectedSignature) {
    throw new Error('Invalid token signature');
  }

  // Decode and parse the JSON payload from Base64URL format
  const payload = JSON.parse(base64UrlDecode(encodedPayload));

  // Check if current time has passed the token expiration time
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token has expired');
  }

  // Return authenticated payload claims to the caller
  return payload;
}

// Export signing and verification methods along with secret configuration
module.exports = {
  sign,
  verify,
  JWT_SECRET
};
