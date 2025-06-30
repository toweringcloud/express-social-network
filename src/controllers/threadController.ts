import type { Request, Response } from "express";
import { desc, eq, ilike } from "drizzle-orm";

import { db } from "../db";
import { threads } from "../db/schema";

// queries (read-list/search/watch)
export const listThread = async (req: Request, res: Response) => {
  try {
    const allThreads = await db
      .select()
      .from(threads)
      .orderBy(desc(threads.createdAt));

    // optional case
    // const allThreads = await db.query.threads.findMany({
    //   orderBy: [desc(threads.createdAt)], // orderBy는 배열로 여러 조건을 받을 수 있습니다.
    //   with: {
    //     owner: {
    //       columns: {
    //         username: true,
    //       },
    //     },
    //   },
    // });

    return res.status(200).json({
      message: `${allThreads.length} threads found.`,
      data: allThreads,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch thread list", error });
  }
};

export const searchThread = async (req: Request, res: Response) => {
  const keyword = req.query.keyword as string;
  if (!keyword) {
    return res.status(400).json({ message: "Keyword not found." });
  }

  try {
    const foundThreads = await db
      .select()
      .from(threads)
      .where(ilike(threads.title, `%${keyword}%`));

    // optional case
    // foundThreads = await db.query.threads.findMany({
    //   where: ilike(threads.title, `%${keyword}%`),
    //   with: {
    //     owner: {
    //       columns: {
    //         username: true,
    //         avatarUrl: true,
    //       },
    //     },
    //   },
    // });

    return res.status(200).json({
      message: `${foundThreads.length} threads matched.`,
      data: foundThreads,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to search threads matching keyword", error });
  }
};

export const readThread = async (req: Request, res: Response) => {
  const { id } = req.params;
  const threadId = parseInt(id, 10);

  const foundThread = await db.query.threads.findFirst({
    where: eq(threads.id, threadId),
    with: { owner: true },
  });
  if (!foundThread) {
    return res.status(404).json({ message: `Thread(${id}) not found.` });
  }

  return res
    .status(200)
    .json({ message: `Thread(${id}) found.`, data: foundThread });
};

// mutations (create, update, delete)
export const createThread = async (req: Request, res: Response) => {
  const {
    body: { title, content },
    session: { user },
    file,
  } = req;

  if (!title || !content) {
    return res.status(400).json({ message: `Title and content are required.` });
  }

  try {
    const [newThread] = await db
      .insert(threads)
      .values({
        title,
        content,
        fileUrl: file ? file.path : undefined,
        ownerId: user.id,
      })
      .returning();
    console.log(newThread);

    return res
      .status(201)
      .json({ message: `new thread(${newThread.id} added.` });
  } catch (error: unknown) {
    console.error("Error adding thread:", error);
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
      .json({ message: "failed to add new thread.", error: errorMessage });
  }
};

export const updateThread = async (req: Request, res: Response) => {
  const {
    params: { id },
    body: { title, content },
    session: { user },
    file,
  } = req;

  const threadId = parseInt(id, 10);
  const foundThread = await db.query.threads.findFirst({
    where: eq(threads.id, threadId),
  });

  if (!foundThread) {
    return res.status(404).json({ message: `thread(${threadId}) not found.` });
  }
  if (String(foundThread.ownerId) !== String(user.id)) {
    return res.status(403).redirect("/");
  }

  await db.update(threads).set({
    title,
    content,
    fileUrl: file ? file.path : undefined,
    updatedAt: new Date(),
  });

  return res.status(200).json({ message: `new thread(${threadId}) modified.` });
};

export const deleteThread = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req.session;

  const threadId = parseInt(id, 10);
  const foundThread = await db.query.threads.findFirst({
    where: eq(threads.id, threadId),
  });

  if (!foundThread) {
    return res.status(404).json({ message: `thread(${threadId}) not found.` });
  }
  if (String(foundThread.ownerId) !== String(user.id)) {
    return res.status(403).redirect("/");
  }

  await db.delete(threads).where(eq(threads.id, threadId));

  return res.status(200).json({ message: `new thread(${threadId}) removed.` });
};
