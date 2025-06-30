import express from "express";

import {
  createThread,
  readMovie,
  updateThread,
  deleteThread,
} from "../controllers/threadController";
import { mediumUpload, protector } from "../middlewares";

const threadRouter = express.Router();

threadRouter.post(
  "/upload",
  protector,
  mediumUpload.single("file"),
  createThread
);
threadRouter.get("/:id([0-9a-f]{24})", readMovie);
threadRouter.put(
  "/:id([0-9a-f]{24})/edit",
  protector,
  mediumUpload.single("file"),
  updateThread
);
threadRouter.delete("/:id([0-9a-f]{24})/delete", protector, deleteThread);

export default threadRouter;
