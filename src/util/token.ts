class TokenHelper {
  generate() {
    return Math.floor(Math.random() * Math.floor(999999999999999)).toString();
  }
}

export default TokenHelper;
