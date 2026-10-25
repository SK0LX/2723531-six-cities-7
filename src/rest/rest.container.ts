import type {Container} from 'inversify';
import {RestApplication} from './rest.application.js';
import {createContainer} from '../shared/container.js';
import {RestConfig} from '../shared/libs/config/index.js';
import type {Config, RestSchema} from '../shared/libs/config/index.js';
import {Component} from '../shared/types/index.js';

export function createRestApplicationContainer(): Container {
  const container = createContainer();

  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();

  return container;
}
