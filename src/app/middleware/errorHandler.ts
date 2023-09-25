import ErrorStack from "../models/Error";

const errorHandler = (err: any, req: any, res: any, next: any) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });

  const errorStack = new ErrorStack({
    status: statusCode,
    error: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });

  errorStack.save();
};

export default errorHandler;
