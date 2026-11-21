import {plainToInstance} from 'class-transformer';
import type {ClassConstructor} from 'class-transformer';
import {validate} from 'class-validator';
import type {ValidatorOptions} from 'class-validator';
import type {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {HttpError} from '../errors/http-error.js';
import type {Middleware} from './middleware.interface.js';

export class ValidateDtoMiddleware implements Middleware {
  constructor(
    private readonly dto: ClassConstructor<object>,
    private readonly validatorOptions?: ValidatorOptions,
  ) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const body: unknown = req.body;

    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Тело запроса должно быть JSON-объектом.');
    }

    const instance = plainToInstance(this.dto, body);

    if (Object.keys(instance).length === 0) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Тело запроса должно содержать хотя бы одно поле.');
    }

    const errors = await validate(instance, this.validatorOptions);

    if (errors.length > 0) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Данные запроса не прошли валидацию.');
    }

    req.body = instance;
    next();
  }
}
