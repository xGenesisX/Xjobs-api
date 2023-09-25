import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";

import errorHandler from "./app/middleware/errorHandler";

import chatRoutes from "./app/routes/chat.route";
import contractRoutes from "./app/routes/contract.route";
import gigRoutes from "./app/routes/gig.route";
import profileRoutes from "./app/routes/profile.route";
import proposalRoutes from "./app/routes/proposal.route";

dotenv.config({ path: __dirname + "/.env" });

const PORT = process.env.PORT || 8080;
const app: Express = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/gig", gigRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/proposal", proposalRoutes);
app.use("/api/v1/contract", contractRoutes);

app.use(errorHandler);

app.get("/health_check", (req: Request, res: Response) => {
  res.send("<h1>Sometimes science is more art than science</h1>");
});
app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Wubba Lubba Dub Dub</h1>");
});

app.get("*", (req: Request, res: Response) => {
  return res.status(404).redirect("/404");
});

app.listen(PORT, () => console.log(`Getting Schwifty on PORT ${PORT} ⚡`));

export { app };
