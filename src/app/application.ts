import 'reflect-metadata';
import {ILog} from '../logger/ilog.js';
import {ISettings} from '../settings/isettings.js';
import {inject, injectable} from 'inversify';
import {Component} from '../types/component.js';
import {SettingsSchema} from '../settings/schema.js';


@injectable()
export default class Application {
  constructor(
    @inject(Component.ILog) private readonly logger: ILog,
    @inject(Component.ISettings) private readonly settings: ISettings<SettingsSchema>,
  ) {}

  public async init() {
    this.logger.info(`PORT: ${this.settings.get('PORT')}`);
    this.logger.info('the application is initialized');
  }
}
