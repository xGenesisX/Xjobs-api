
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import mongoose, { ObjectId } from "mongoose";

export interface CustomRequest extends Request {
  currentUser?: { user_id: mongoose.Types.ObjectId; address: string };
}

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Unauthorized - Missing Authorization header" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid Authorization header format" });
  }

  try {
    const decoded = jwt.verify(token, "JSONXJOBSKEY$") as {
      user_id: mongoose.Types.ObjectId;
      address: string;
    };
    req.currentUser = decoded;

    console.log(decoded);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

export default verifyToken;
