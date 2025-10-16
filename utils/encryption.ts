// RSA Encryption Utility for Yodlee Bank Linking
// Ported from legacy webapp: /webapp/app/utils/encrypt-to-hex.js

import { JSEncrypt } from 'jsencrypt';

/**
 * Encrypt a message using RSA public key
 * @param message - The message to encrypt
 * @param publicKey - Base64-encoded RSA public key
 * @returns Encrypted message as base64 string
 */
function encryptMessage(message: string, publicKey: string): string | false {
  const jsEncrypt = new JSEncrypt();
  jsEncrypt.setPublicKey(publicKey);

  return jsEncrypt.encrypt(message);
}

/**
 * Encrypt message to hex string (matching backend expectations)
 * This is the format required by the 22seven/Yodlee backend
 *
 * @param message - The plaintext message (username/password)
 * @param publicKey - Base64-encoded RSA public key from aggregate.config.encryptionKey
 * @returns Hex-encoded encrypted string
 *
 * @example
 * const publicKey = aggregate.config.encryptionKey;
 * const encryptedPassword = encryptToHex('myPassword123', publicKey);
 * // Returns: "a3f2c8d9e1b4..."
 */
export default function encryptToHex(message: string | null, publicKey: string): string {
  if (message === null || message === '') {
    return '';
  }

  try {
    // Step 1: Encrypt message with RSA public key
    const encryptedBase64 = encryptMessage(message, publicKey);

    if (!encryptedBase64) {
      throw new Error('Encryption failed');
    }

    // Step 2: Convert base64 to Uint8Array
    const atobMsg = Uint8Array.from(atob(encryptedBase64), (c) => c.charCodeAt(0));

    // Step 3: Convert Uint8Array to hex string
    // Each byte is converted to 2-character hex (padded with 0 if needed)
    return atobMsg.reduce(
      (output, elem) => output + `0${elem.toString(16)}`.slice(-2),
      ''
    );
  } catch (error) {
    console.error('[Encryption] Failed to encrypt message:', error);
    return '';
  }
}

/**
 * Simplified encryption function (alias for backward compatibility)
 * @param message - The message to encrypt
 * @param publicKey - Base64-encoded RSA public key
 * @returns Hex-encoded encrypted string
 */
export function encrypt(message: string, publicKey: string): string {
  return encryptToHex(message, publicKey);
}
