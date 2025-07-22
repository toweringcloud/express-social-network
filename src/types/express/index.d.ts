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
      buffer: any;
      mimetype: string;
      originalname: string;
      path: string;
    };
  }
}
