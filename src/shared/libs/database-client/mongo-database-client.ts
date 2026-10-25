import mongoose from 'mongoose';
import type {Mongoose} from 'mongoose';
import {inject, injectable} from 'inversify';
import type {DatabaseClient} from './database-client.interface.js';
import type {Logger} from '../../logger/index.js';
import {Component} from '../../types/index.js';

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private connection: Mongoose | null = null;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {}

  public async connect(uri: string): Promise<void> {
    if (this.connection) {
      throw new Error('Соединение с MongoDB уже установлено.');
    }

    this.logger.info('Попытка подключения к MongoDB.');

    this.connection = await mongoose.connect(uri);

    const {port, name} = this.connection.connection;
    this.logger.info(`Соединение с MongoDB установлено: port=${port}, database=${name}.`);
  }

  public async disconnect(): Promise<void> {
    if (!this.connection) {
      throw new Error('Соединение с MongoDB не установлено.');
    }

    const {port, name} = this.connection.connection;
    await this.connection.disconnect();
    this.connection = null;

    this.logger.info(`Соединение с MongoDB закрыто: port=${port}, database=${name}.`);
  }
}
