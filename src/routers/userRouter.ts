import express from "express";

import { githubLogin, githubCallback } from "../controllers/githubController";
import {
  readProfile,
  updateProfile,
  changePassword,
} from "../controllers/userController";
import { fileUpload, protector, publicOnly } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/github", publicOnly, githubLogin);
userRouter.get("/github/callback", publicOnly, githubCallback);
userRouter.get("/:id", readProfile);
userRouter.post(
  "/edit",
  protector,
  fileUpload("avatars", 5).single("avatar"),
  updateProfile
);
userRouter.post("/change-pw", protector, changePassword);

export default userRouter;
