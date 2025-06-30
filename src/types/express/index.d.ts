import "express";

declare module "express" {
  interface Request {
    session: {
      loggedIn?: boolean;
      [key: string]: any;
    };
    query: {
      code?: string;
      [key: string]: any;
    };
    file?: {
      path: string;
      [key: string]: any;
    };
  }
}
