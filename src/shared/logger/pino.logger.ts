import {pino} from 'pino';
import {injectable} from 'inversify';
import type {Logger as PinoInstance} from 'pino';
import type {Logger} from './logger.interface.js';

@injectable()
export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;

  constructor() {
    this.logger = pino();
  }

  public debug(message: string, ...args: unknown[]): void {
    const log: Logger['debug'] = this.logger.debug.bind(this.logger);
    log(message, ...args);
  }

  public error(message: string, error: Error, ...args: unknown[]): void {
    this.logger.error(error, message, ...args);
  }

  public info(message: string, ...args: unknown[]): void {
    const log: Logger['info'] = this.logger.info.bind(this.logger);
    log(message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    const log: Logger['warn'] = this.logger.warn.bind(this.logger);
    log(message, ...args);
  }
}
