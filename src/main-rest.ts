import 'reflect-metadata';
import {Container} from 'inversify';
import {PinoLogger} from './shared/logger/index.js';
import type {Logger} from './shared/logger/index.js';
import {RestApplication} from './rest/rest.application.js';
import {RestConfig} from './shared/libs/config/index.js';
import type {Config, RestSchema} from './shared/libs/config/index.js';
import {Component} from './shared/types/index.js';

async function bootstrap(): Promise<void> {
  const container = new Container();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();

  const application = container.get<RestApplication>(Component.RestApplication);
  await application.init();
}

await bootstrap();
