import 'reflect-metadata';
import {ILog} from '../logger/ilog.js';
import {ISettings} from '../settings/isettings.js';
import {inject, injectable} from 'inversify';
import {Component} from '../types/component.js';
import {SettingsSchema} from '../settings/schema.js';
import { IDatabaseClient } from '../db/idatabase-client.js';
import { getConnectionString } from '../helpers/database.js';


@injectable()
export default class Application {
  constructor(
    @inject(Component.ILog) private readonly logger: ILog,
    @inject(Component.ISettings) private readonly settings: ISettings<SettingsSchema>,
    @inject(Component.IDatabaseClient) private readonly databaseClient: IDatabaseClient
  ) {}

  public async init() {
    this.logger.info(`PORT: ${this.settings.get('PORT')}`);
    this.logger.info('the application is initialized');

    const mongoUri = getConnectionString(
      this.settings.get('DB_USER'),
      this.settings.get('DB_PASSWORD'),
      this.settings.get('DB_HOST'),
      this.settings.get('DB_PORT'),
      this.settings.get('DB_NAME'),
    );

    await this.databaseClient.connect(mongoUri);
    this.logger.info('the database is initialized');
  }
}
