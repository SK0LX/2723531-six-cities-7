import type {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {isValidObjectId} from 'mongoose';
import {HttpError} from '../errors/http-error.js';
import type {Middleware} from './middleware.interface.js';

type RequestSource = 'params' | 'query' | 'body';

export class ValidateObjectIdMiddleware implements Middleware {
  constructor(
    private readonly field: string,
    private readonly source: RequestSource = 'params',
  ) {}

  public execute(req: Request, _res: Response, next: NextFunction): void {
    const value: unknown = req[this.source]?.[this.field];

    if (typeof value !== 'string' || !isValidObjectId(value)) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `Некорректный идентификатор в поле ${this.field}.`);
    }

    next();
  }
}
