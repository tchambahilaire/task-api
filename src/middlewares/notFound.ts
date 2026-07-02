import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../exceptions/AppError';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl}`));
};
