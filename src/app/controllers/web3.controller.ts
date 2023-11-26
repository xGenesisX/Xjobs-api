import { Request, Response } from "express";
import httpStatus from "http-status";
import { getToken } from "next-auth/jwt";
import catchAsync from "../utils/catchAsync";
import { SPLWeb3 } from "../services/web3";

export const receiveSOL = catchAsync(async (req: Request, res: Response) => {
  let token = getToken({ req });
  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED);
  } else {
    try {
      const p = new SPLWeb3(0, "mainnet").receiveSOL;
      res.send(p);
    } catch (error) {
      res.status(400).json(error);
    }
  }
});
export const sendSOL = catchAsync(async (req: Request, res: Response) => {
  let token = getToken({ req });
  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED);
  } else {
    try {
      const p = new SPLWeb3(0, "mainnet").sendSOL;
      res.send(p);
    } catch (error) {
      res.status(400).json(error);
    }
  }
});
