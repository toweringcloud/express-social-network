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
    return res.redirect("/login");
  }
};

export const publicOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "files/avatars/",
  limits: { fileSize: 1000000 },
});

export const mediumUpload = multer({
  dest: "files/media/",
  limits: { fileSize: 10000000 },
});
