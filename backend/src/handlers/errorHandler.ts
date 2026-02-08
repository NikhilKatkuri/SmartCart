import 'dotenv/config';

const production_mode = process.env['NODE_ENV'] === 'production' ? true : false;

import { Request, Response, NextFunction } from 'express';

export const errorHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (production_mode) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  } else {
    res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }
};
