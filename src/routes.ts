import express from "express";
import timeout from "connect-timeout";

import CEIController from "./controllers/CEIController";

const routes = express.Router();

const ceiController = new CEIController();

routes.get("/", (req, res) => res.json({ status: "Online" }));
routes.post("/token", ceiController.createToken);
routes.get("/wallet", timeout("90s"), ceiController.getWallet);
routes.get("/dividends", timeout("90s"), ceiController.getDividends);
routes.get("/transactions", timeout("90s"), ceiController.getTransactions);

export default routes;
