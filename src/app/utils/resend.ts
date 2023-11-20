import { Resend } from "resend";
import config from "../config/config";

export const resend = new Resend(config.resend);
// export const resend = new Resend("re_UYDYbS7h_AB7dSoEZEL1oZzNMwi8SripS");
