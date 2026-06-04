/**
 * Menghasilkan hash SHA-256 dari string password.
 * Menggunakan Web Crypto API bawaan browser yang aman dan ringan.
 * 
 * @param {string} password - Password mentah (plaintext)
 * @returns {Promise<string>} - Password yang sudah di-hash (hex string)
 */
export const hashPassword = async (password) => {
  const msgBuffer = new TextEncoder().encode(password);
  // Hash the password using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  
  // Convert the ArrayBuffer to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
};
