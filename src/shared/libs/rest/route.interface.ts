import type {NextFunction, Request, Response} from 'express';
import type {HttpMethod} from '../../types/http-method.enum.js';
import type {Middleware} from './middleware/middleware.interface.js';

export interface Route {
  path: string;
  method: HttpMethod;
  middlewares?: Middleware[];
  handler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;
}
