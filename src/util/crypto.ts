import crypto from "crypto-js";

const secretKey = process.env.SECRET_KEY || "SECRET";

class CryptoHelper {
  encrypt(text: string) {
    const encryptedText = crypto.DES.encrypt(text, secretKey).toString();
    return encryptedText;
  }

  decrypt(encryptedText: string) {
    const decryptedText = crypto.DES.decrypt(encryptedText, secretKey).toString(
      crypto.enc.Utf8
    );
    return decryptedText;
  }
}

export default CryptoHelper;
