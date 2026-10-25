import dotenv from 'dotenv';
import {inject, injectable} from 'inversify';
import type Config from './config.interface.js';
import type RestSchema from './rest.schema.js';
import {configRestSchema} from './rest.schema.js';
import type {Logger} from '../../logger/index.js';
import {Component} from '../../types/index.js';

@injectable()
export class RestConfig implements Config<RestSchema> {
  private readonly config: RestSchema;

  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    const parsedOutput = dotenv.config({quiet: true});

    if (parsedOutput.error) {
      throw new Error('Не удалось загрузить конфигурацию приложения.');
    }

    configRestSchema.load({});
    configRestSchema.validate({
      allowed: 'strict',
      output: (message: string) => this.logger.info(message),
    });

    this.config = configRestSchema.getProperties();
    this.logger.info(`Конфигурация проверена: параметров=${Object.keys(this.config).length}.`);
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
