import knex from "../database/connection";
import CryptoHelper from "../util/crypto";

const cryptoHelper = new CryptoHelper();

class CredentialsRepository {
  async getExistentToken(username: string, password: string) {
    const data = await knex("credentials")
      .where("username", String(username))
      .select("*");

    if (data) {
      const existent = data.filter(
        (item) => cryptoHelper.decrypt(item.password) === password
      );
      if (existent && existent[0]) return existent[0].token;
    }

    return null;
  }

  async getCredentialsByToken(token: string) {
    const data = await knex("credentials").where("token", token).first();

    if (!data) return null;

    return {
      username: data.username as string,
      password: cryptoHelper.decrypt(data.password),
    };
  }
}

export default CredentialsRepository;
