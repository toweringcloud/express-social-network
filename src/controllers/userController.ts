import type { Request, Response } from "express";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcrypt";

import { db } from "../db";
import { users } from "../db/schema";

export const signup = async (req: Request, res: Response) => {
  const { username, email, password, password2 } = req.body;

  if (password !== password2) {
    return res.status(400).json({
      message: "😖 Password confirmation does not match.",
    });
  }

  try {
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(or(eq(users.username, username), eq(users.email, email)))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "😖 This username/email is already taken.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert(users).values({
      username,
      email,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json({ message: `new user(${username}) signed up.` });
  } catch (error: unknown) {
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
      .json({ message: "failed to add new user.", error: errorMessage });
  }
};

export const signin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const foundUsers = await db
    .select()
    .from(users)
    .where(eq(users.username, username));

  if (foundUsers.length === 0) {
    return res.status(400).json({
      message: "An account with this username does not exist.",
    });
  }

  const foundUser = foundUsers[0];
  if (!foundUser.password) {
    return res.status(400).json({
      message: "This account is for social login only.",
    });
  }

  const ok = await bcrypt.compare(password, foundUser.password);
  if (!ok) {
    return res.status(400).json({
      message: "Wrong password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = foundUser;
  return res.status(200).json({ message: `user(${username} signed in.` });
};

export const signout = (req: Request, res: Response) => {
  req.session.destroy();
  return res.redirect("/");
};

export const readProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid User ID." });
  }

  try {
    const foundUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: { threads: true },
    });
    if (!foundUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: `${foundUser.username}'s Profile`,
      data: foundUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "failed to find user profile", error });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const {
    session: {
      user: { id, avatarUrl },
    },
    body: { email, username, nickname, location },
    file,
  } = req;

  const userId = parseInt(id, 10);
  const foundUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!foundUser) {
    return res.status(400).json({
      message: "An account with this username does not exist.",
    });
  }

  const [updatedUser] = await db
    .update(users)
    .set({
      email,
      username,
      nickname,
      location,
      avatarUrl: file ? file.path : avatarUrl,
    })
    .where(eq(users.id, userId))
    .returning();
  console.log(updatedUser);

  req.session.user = updatedUser;
  return res
    .status(200)
    .json({ message: `user(${userId})'s profile modified.` });
};

export const changePassword = async (req: Request, res: Response) => {
  const {
    session: { user },
    body: { oldPassword, newPassword, newPassword2 },
  } = req;

  const userId = parseInt(user.id, 10);
  const foundUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!foundUser) {
    return res.status(400).json({
      message: "An account with this username does not exist.",
    });
  }

  const ok = await bcrypt.compare(oldPassword, foundUser.password!);
  if (!ok) {
    return res.status(400).json({
      message: "😖 The current password is incorrect",
    });
  }

  if (newPassword !== newPassword2) {
    return res.status(400).json({
      message: "😖 The password does not match the confirmation",
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, userId));

  return res
    .status(200)
    .json({ message: `user(${userId})'s password changed.` });
};
