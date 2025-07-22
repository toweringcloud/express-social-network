import express from "express";

import {
  createThread,
  readThread,
  updateThread,
  deleteThread,
} from "../controllers/threadController";
import { fileUpload, protector } from "../middlewares";

const threadRouter = express.Router();

threadRouter.post(
  "/upload",
  protector,
  fileUpload("photos", 5).single("photo"),
  createThread
);
threadRouter.get("/:id([0-9a-f]{24})", readThread);
threadRouter.put(
  "/:id([0-9a-f]{24})/edit",
  protector,
  fileUpload("photos", 5).single("photo"),
  updateThread
);
threadRouter.delete("/:id([0-9a-f]{24})/delete", protector, deleteThread);

export default threadRouter;
