import 'reflect-metadata';
import Log from './logger/log.js';
import {Component} from './types/component.js';
import Application from './app/application.js';
import {ILog} from './logger/ilog.js';
import {ISettings} from './settings/isettings.js';
import {SettingsSchema} from './settings/schema.js';
import Settings from './settings/settings.js';
import {Container} from 'inversify';


const container = new Container();
container.bind<Application>(Component.Application).to(Application).inSingletonScope();
container.bind<ILog>(Component.ILog).to(Log).inSingletonScope();
container.bind<ISettings<SettingsSchema>>(Component.ISettings).to(Settings).inSingletonScope();

const application = container.get<Application>(Component.Application);
await application.init();
