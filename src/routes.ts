import express from "express";

import CEIController from "./controllers/CEIController";

const routes = express.Router();

const ceiController = new CEIController();

routes.post("/token", ceiController.createToken);
routes.get("/wallet", ceiController.getWallet);
routes.get("/dividends", ceiController.getDividends);
routes.get("/transactions", ceiController.getTransactions);

export default routes;
