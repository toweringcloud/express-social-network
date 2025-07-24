import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import axios from "axios";

import { db } from "../models";
import { users } from "../models/schema";

export const githubLogin = (req: Request, res: Response) => {
  const baseUrl = `${process.env.GITHUB_AUTH_URL}/authorize`;
  const config: Record<string, string> = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    allow_signup: "false",
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const githubCallback = async (req: Request, res: Response) => {
  const baseUrl = `${process.env.GITHUB_AUTH_URL}/access_token`;
  const configObj: Record<string, string> = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code: req.query.code!,
  };
  const loginParams = new URLSearchParams(configObj).toString();
  const tokenRes = await (
    await axios.post(`${baseUrl}?${loginParams}`, {
      headers: { Accept: "application/json" },
    })
  ).data;

  const tokenFirst = tokenRes.split("&")[0].split("=");
  if ("access_token" == tokenFirst[0]) {
    const access_token = tokenFirst[1];
    const baseUrl = `${process.env.GITHUB_API_URL}/user`;

    const userData = await (
      await axios.get(baseUrl, {
        headers: { Authorization: `token ${access_token}` },
      })
    ).data;

    const emailData = await (
      await axios.get(`${baseUrl}/emails`, {
        headers: { Authorization: `token ${access_token}` },
      })
    ).data;
    const emailObj = emailData.find(
      (email: { primary: boolean; verified: boolean }) =>
        email.primary === true && email.verified === true
    );

    if (!emailObj) {
      return res.status(400).json({
        message: "😖 your github's email not available.",
      });
    }

    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, emailObj.email))
      .limit(1);

    if (!user || user.length === 0) {
      await db.insert(users).values({
        socialOnly: true,
        username: userData.login,
        email: emailObj.email,
        nickname: userData.name,
        avatarUrl: userData.avatar_url,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.status(400).json({
      message: "😖 your github's token not valid.",
    });
  }
};
