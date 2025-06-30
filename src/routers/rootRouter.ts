import express, { Request, Response } from "express";

import { listThread, searchThread } from "../controllers/threadController";
import { signup, signin, signout } from "../controllers/userController";
import { protector, publicOnly } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Bun + Express + Drizzle App!");
});
rootRouter.get("/", listThread);
rootRouter.get("/search", searchThread);
rootRouter.post("/join", publicOnly, signup);
rootRouter.post("/login", publicOnly, signin);
rootRouter.get("/logout", protector, signout);

export default rootRouter;
