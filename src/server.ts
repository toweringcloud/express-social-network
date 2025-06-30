import connectPgSimple from "connect-pg-simple";
import express from "express";
import morgan from "morgan";
import session from "express-session";
import swaggerUi from "swagger-ui-express";

import rootRouter from "./routers/rootRouter";
import threadRouter from "./routers/threadRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./middlewares";
import { specs } from "./utils/swagger";
import { pool } from "./db";

const app = express();
const PGStore = connectPgSimple(session);

// Logger & ...
const logger = morgan("dev");
app.use(logger);
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Session for Cookie
app.use(
  session({
    secret: process.env.COOKIE_SECRET!,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
    store: new PGStore({
      pool: pool,
      tableName: "sessions",
      createTableIfMissing: true,
    }),
  })
);
app.use(localsMiddleware);

// Public Path
app.use(express.static("public"));
app.use("/uploads", express.static("files"));

// Custom Routes
app.use("/", rootRouter);
app.use("/threads", threadRouter);
app.use("/users", userRouter);

export default app;
