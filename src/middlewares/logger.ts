import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const logRequest = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, originalUrl, ip, headers } = req;
  const userAgent = headers['user-agent'] || 'unknown';

  // Log au début de la requête (optionnel)
  // logger.debug(`${method} ${originalUrl} - Début`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    
    const logLevel = statusCode >= 500 ? 'error' 
                   : statusCode >= 400 ? 'warn' 
                   : 'info';

    logger[logLevel](`${method} ${originalUrl} - ${statusCode} - ${duration}ms - ${ip} - ${userAgent}`);
  });

  next();
};
