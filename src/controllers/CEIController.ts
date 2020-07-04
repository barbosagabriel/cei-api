import { Request, Response } from "express";
import knex from "../database/connection";
import TokenHelper from "../util/token";
import CryptoHelper from "../util/crypto";
import CredentialsRepository from "../repository/credentialsRepository";

const CeiCrawler = require("cei-crawler");

const tokenHelper = new TokenHelper();
const cryptoHelper = new CryptoHelper();
const credentialsRepository = new CredentialsRepository();

const LOGIN_FAILED_MESSAGE = "Login falhou";
const CRAWLER_OPTIONS = {
  puppeteerLaunch: {
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--single-process",
    ],
  },
  trace: true,
};

class CEIController {
  async createToken(req: Request, res: Response) {
    try {
      let username = req.body.username;
      let password = req.body.password;

      const existentToken = await credentialsRepository.getExistentToken(
        username,
        password
      );

      if (existentToken) {
        console.log("Existent token for user:", existentToken);
        return res.status(201).json({ token: existentToken });
      }

      const encryptedPass = cryptoHelper.encrypt(password);
      const token = tokenHelper.generate();

      const data = {
        username: username,
        password: encryptedPass,
        token,
      };

      console.log("Inserting new credentials: ", data);

      await knex("credentials").insert(data);

      res.status(201).json({ token: token });
    } catch (error) {
      console.log("Error:", error);
      res.status(500).json();
    }
  }

  async getWallet(req: Request, res: Response) {
    const token = req.query.token as string;
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }
    const data = await credentialsRepository.getCredentialsByToken(token);

    if (!data) {
      res.status(401).json({ error: "Invalid token" });
    }

    let ceiCrawler = new CeiCrawler(
      data!.username,
      data!.password,
      CRAWLER_OPTIONS
    );

    try {
      console.log(`Searching wallet - Current date`);
      const result = await ceiCrawler.getWallet();
      await ceiCrawler.close();

      console.log(`Data collected with success`);
      res.status(200).json(result);
    } catch (error) {
      console.log("Error:", error);
      const errorMsg = error.message as string;
      if (errorMsg.includes(LOGIN_FAILED_MESSAGE))
        return res
          .status(401)
          .json({ error: "Login failed. Check your CEI credentials." });

      return res.status(500).json(error);
    }
  }

  async getDividends(req: Request, res: Response) {
    const token = req.query.token as string;
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }
    const data = await credentialsRepository.getCredentialsByToken(token);

    if (!data) {
      res.status(401).json({ error: "Invalid token" });
    }

    try {
      let ceiCrawler = new CeiCrawler(
        data!.username,
        data!.password,
        CRAWLER_OPTIONS
      );

      console.log(`Searching dividends`);
      const result = await ceiCrawler.getDividends();
      await ceiCrawler.close();

      console.log(`Data collected with success`);
      return res.status(200).json(result);
    } catch (error) {
      console.log("Error:", error);
      const errorMsg = error.message as string;
      if (errorMsg.includes(LOGIN_FAILED_MESSAGE))
        return res
          .status(401)
          .json({ error: "Login failed. Check your CEI credentials." });

      return res.status(500).json(error);
    }
  }

  async getTransactions(req: Request, res: Response) {
    const { startDate, endDate } = req.query;
    const token = req.query.token as string;
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }
    const data = await credentialsRepository.getCredentialsByToken(token);

    if (!data) {
      res.status(401).json({ error: "Invalid token" });
    }

    let ceiCrawler = new CeiCrawler(
      data!.username,
      data!.password,
      CRAWLER_OPTIONS
    );

    try {
      var result;

      if (!startDate && !endDate) {
        console.log(`Searching all stock transactions`);
        result = await ceiCrawler.getStockHistory();
      } else {
        console.log(
          `Searching stock transactions between ${startDate} and ${endDate}`
        );
        const start = new Date(String(startDate));
        const end = new Date(String(endDate));
        result = await ceiCrawler.getStockHistory(start, end);
      }
      await ceiCrawler.close();

      console.log(`Data collected with success`);
      res.status(200).json(result);
    } catch (error) {
      console.log("Error:", error);
      const errorMsg = error.message as string;
      if (errorMsg.includes(LOGIN_FAILED_MESSAGE))
        return res
          .status(401)
          .json({ error: "Login failed. Check your CEI credentials." });

      return res.status(500).json(error);
    }
  }
}

export default CEIController;
