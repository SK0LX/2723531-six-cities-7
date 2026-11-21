import {extname} from 'node:path';
import type {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import multer from 'multer';
import {HttpError} from '../../libs/rest/index.js';
import type {Middleware} from '../../libs/rest/index.js';

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

export class UploadAvatarMiddleware implements Middleware {
  private readonly upload = multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: MAX_AVATAR_BYTES, files: 1, fields: 0},
  }).single('avatar');

  public execute(req: Request, res: Response, next: NextFunction): void {
    if (!req.is('multipart/form-data')) {
      throw new HttpError(StatusCodes.UNSUPPORTED_MEDIA_TYPE, 'Отправьте аватар в формате multipart/form-data.');
    }

    this.upload(req, res, (error: unknown) => {
      if (error) {
        const message = error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE'
          ? 'Размер аватара не должен превышать 2 МиБ.'
          : 'Отправьте один файл в поле avatar.';
        next(new HttpError(StatusCodes.BAD_REQUEST, message));
        return;
      }

      if (!req.file || !this.isSupportedImage(req.file)) {
        next(new HttpError(StatusCodes.BAD_REQUEST, 'Загрузите изображение в формате JPG или PNG.'));
        return;
      }

      next();
    });
  }

  private isSupportedImage(file: Express.Multer.File): boolean {
    const extension = extname(file.originalname).toLowerCase();

    if (extension === '.jpg' && file.mimetype === 'image/jpeg') {
      return file.buffer.subarray(0, 3).toString('hex') === 'ffd8ff';
    }

    return extension === '.png' && file.mimetype === 'image/png' &&
      file.buffer.subarray(0, 8).toString('hex') === '89504e470d0a1a0a';
  }
}
