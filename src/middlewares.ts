import type { Request, Response, NextFunction } from "express";
import multer from "multer";

export const localsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.siteTitle = "Nomad Threads";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user;
  next();
};

export const protector = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.sendStatus(401);
  }
};

export const publicOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};

export const fileUpload = (path: string, size: number) =>
  process.env.MODE === "OPS"
    ? multer({
        storage: multer.memoryStorage(),
        limits: { fileSize: size * 1024 * 1024 },
      })
    : multer({
        dest: `files/${path}/`,
        limits: { fileSize: size * 1024 * 1024 },
      });
