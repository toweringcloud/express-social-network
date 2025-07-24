import type { Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../models";
import { comments, threads } from "../models/schema";

// mutations (create, update, delete)
export const createComment = async (req: Request, res: Response) => {
  const {
    params: { id },
    body: { content },
    session: { user },
  } = req;

  const threadId = parseInt(id, 10);
  const foundThread = await db.query.threads.findFirst({
    where: eq(threads.id, threadId),
  });
  if (!foundThread) {
    return res
      .status(404)
      .json({ message: `😖 thread(${threadId}) not found.` });
  }

  if (!content) {
    return res.status(400).json({ message: `😖 content are required.` });
  }

  try {
    const [newComment] = await db
      .insert(comments)
      .values({
        content,
        threadId,
        userId: user.id,
      })
      .returning();
    console.log(newComment);

    return res
      .status(201)
      .json({ message: `😎 new comment(${newComment.id}) added.` });
  } catch (error: unknown) {
    console.error("Error adding comment:", error);
    let errorMessage: string = "Unknown Error";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (
      typeof error === "object" &&
      error !== null &&
      "_message" in error
    ) {
      errorMessage = (error as { _message: string })._message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return res
      .status(500)
      .json({ message: "failed to add new comment.", error: errorMessage });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  const {
    params: { id, cid },
    body: { content },
    session: { user },
  } = req;

  const threadId = parseInt(id, 10);
  const foundThread = await db.query.threads.findFirst({
    where: eq(threads.id, threadId),
  });
  if (!foundThread) {
    return res
      .status(404)
      .json({ message: `😖 thread(${threadId}) not found.` });
  }

  const commentId = parseInt(cid, 10);
  const foundComment = await db.query.comments.findFirst({
    where: eq(comments.id, commentId),
  });
  if (foundComment) {
    if (String(foundComment.userId) !== String(user.id)) {
      return res.status(403).end();
    }
  } else {
    return res
      .status(404)
      .json({ message: `😖 comment(${commentId}) not found.` });
  }

  await db
    .update(comments)
    .set({
      content,
      updatedAt: new Date(),
    })
    .where(eq(comments.id, commentId));

  return res
    .status(200)
    .json({ message: `😎 new comment(${commentId}) modified.` });
};

export const deleteComment = async (req: Request, res: Response) => {
  const { id, cid } = req.params;
  const { user } = req.session;

  const threadId = parseInt(id, 10);
  const foundThread = await db.query.threads.findFirst({
    where: eq(threads.id, threadId),
  });
  if (!foundThread) {
    return res
      .status(404)
      .json({ message: `😖 thread(${threadId}) not found.` });
  }

  const commentId = parseInt(cid, 10);
  const foundComment = await db.query.comments.findFirst({
    where: eq(comments.id, commentId),
  });
  if (foundComment) {
    if (String(foundComment.userId) !== String(user.id)) {
      return res.status(403).end();
    }
  } else {
    return res
      .status(404)
      .json({ message: `😖 comment(${commentId}) not found.` });
  }

  await db.delete(comments).where(eq(comments.id, commentId));
  return res.status(204).end();
};
