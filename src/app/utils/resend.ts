import { Resend } from "resend";
import config from "../config/config";

export const resend = new Resend(config.resend);
