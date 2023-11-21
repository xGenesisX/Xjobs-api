import compression from "compression";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import ExpressMongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import httpStatus from "http-status";
import morgan from "morgan";
import passport from "passport";
import errorHandler from "./app/middleware/errorHandler";
import chatRoutes from "./app/routes/chat.route";
import contractRoutes from "./app/routes/contract.route";
import gigRoutes from "./app/routes/gig.route";
import profileRoutes from "./app/routes/profile.route";
import proposalRoutes from "./app/routes/proposal.route";
import db from "./app/utils/db";

import config from "./app/config/config";

const PORT = config.port || 3000;
const app: Express = express();

const corsOptions = {
  origin: `http://localhost:${PORT}`,
};

app.use(helmet());
app.use(cors(corsOptions));
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(ExpressMongoSanitize());

// gzip compression
app.use(compression());

// jwt authentication
app.use(passport.initialize());

app.use("/v1/gig", gigRoutes);
app.use("/v1/profile", profileRoutes);
app.use("/v1/chat", chatRoutes);
app.use("/v1/proposal", proposalRoutes);
app.use("/v1/contract", contractRoutes);

app.use(errorHandler);

db();

app.get("/health_check", (req: Request, res: Response) => {
  res.send("Sometimes science is more art than science");
});

app.get("/", (req: Request, res: Response) => {
  res.send("Wubba Lubba Dub Dub");
});

app.get("*", (req: Request, res: Response) => {
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).redirect("/404");
});

// handle error
app.use(errorHandler);

app.listen(PORT, () => console.log(`Getting Schwifty on PORT ${PORT} ⚡`));

export default app;
