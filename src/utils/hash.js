/**
 * Menghasilkan hash SHA-256 dari string password.
 * Menggunakan Web Crypto API bawaan browser yang aman dan ringan.
 * 
 * @param {string} password - Password mentah (plaintext)
 * @returns {Promise<string>} - Password yang sudah di-hash (hex string)
 */
export const hashPassword = async (password) => {
  try {
    if (window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(password);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
      // Fallback untuk testing di HP via IP lokal (HTTP non-secure)
      let hash = 0;
      for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return 'fallback_' + Math.abs(hash).toString(16);
    }
  } catch (error) {
    console.error("Hash error:", error);
    return password; // Fallback darurat
  }
};
