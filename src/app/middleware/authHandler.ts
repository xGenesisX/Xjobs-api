import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
// import asyncHandler from "express-async-handler";
// import jwt from "jsonwebtoken"; // install jst types.

export const authenticate = /*asyncHandler*/ async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKey = req.headers["x-api-key"] as string;
    if (apiKey) {
      const isAuthenticated = await bcrypt.compare(
        apiKey,
        process.env.HASHED_KEY as string
      );
      if (!isAuthenticated) {
        res.status(401);
        next(new Error("Unauthorized Credentials"));
      }
      next();
    } else {
      res.status(500);
      next(new Error("No credentials found"));
    }
  } catch (error) {
    res.status(500);
    next(error);
  }
};
