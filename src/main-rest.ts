import 'reflect-metadata';
import type {RestApplication} from './rest/rest.application.js';
import {createRestApplicationContainer} from './rest/rest.container.js';
import {Component} from './shared/types/index.js';

async function bootstrap(): Promise<void> {
  const container = createRestApplicationContainer();
  const application = container.get<RestApplication>(Component.RestApplication);
  await application.init();
}

await bootstrap();
