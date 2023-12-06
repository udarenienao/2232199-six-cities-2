import {Container} from 'inversify';
import Application from './application.js';
import { ILog } from '../logger/ilog.js';
import { Component } from '../types/component.js';
import Log from '../logger/log.js';
import { ISettings } from '../settings/isettings.js';
import { SettingsSchema } from '../settings/schema.js';
import Settings from '../settings/settings.js';
import { IDatabaseClient } from '../db/idatabase-client.js';
import MongoClient from '../db/mongo-client.js';
import ExceptionFilter from '../exceptions/exception-filter.js';
import { IExceptionFilter } from '../exceptions/iexception-filter.js';

export function createApplicationContainer() {
  const applicationContainer = new Container();
  applicationContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
  applicationContainer.bind<ILog>(Component.ILog).to(Log).inSingletonScope();
  applicationContainer.bind<ISettings<SettingsSchema>>(Component.ISettings).to(Settings).inSingletonScope();
  applicationContainer.bind<IDatabaseClient>(Component.IDatabaseClient).to(MongoClient).inSingletonScope();
  applicationContainer.bind<IExceptionFilter>(Component.ExceptionFilter).to(ExceptionFilter).inSingletonScope();

  return applicationContainer;
}
