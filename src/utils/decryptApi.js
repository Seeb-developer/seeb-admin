import CryptoJS from "crypto-js";

export function decryptCBCResponse(response) {
    // console.log("API Response:", response);

    if (!response?.encrypted) return response;

    const { cipher, iv, hmac } = response.payload;
    // 🔑 Keys (must be identical to backend)
    const aesKey = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_AES_KEY);
    const hmacKey = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_API_HMAC_KEY);

    // 🔐 Decode Base64 → RAW BYTES
    const ivBytes = CryptoJS.enc.Base64.parse(iv);
    const cipherBytes = CryptoJS.enc.Base64.parse(cipher);

    // 🔐 Compute HMAC over RAW BYTES (IV + CIPHER)
    const macCheck = CryptoJS.HmacSHA256(
        ivBytes.clone().concat(cipherBytes),
        hmacKey
    ).toString(CryptoJS.enc.Base64);

    if (macCheck !== hmac) {
        throw new Error("HMAC verification failed (data tampered)");
    }

    // 🔓 AES Decrypt
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: cipherBytes },
        aesKey,
        {
            iv: ivBytes,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        }
    );

    const text = decrypted.toString(CryptoJS.enc.Utf8);
    if (!text) throw new Error("AES decryption failed");

    return JSON.parse(text);
}
