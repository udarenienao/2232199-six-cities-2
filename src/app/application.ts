import 'reflect-metadata';
import {ILog} from '../logger/ilog.js';
import {ISettings} from '../settings/isettings.js';
import {inject, injectable} from 'inversify';
import express, { Express } from 'express';
import {Component} from '../types/component.js';
import {SettingsSchema} from '../settings/schema.js';
import { IDatabaseClient } from '../db/idatabase-client.js';
import { getConnectionString } from '../helpers/database.js';
import { IController } from '../controller/icontroller.js';
import { IExceptionFilter } from '../exceptions/iexception-filter.js';


@injectable()
export default class Application {
  private expressApplication: Express;
  constructor(
    @inject(Component.ILog) private readonly logger: ILog,
    @inject(Component.ISettings) private readonly settings: ISettings<SettingsSchema>,
    @inject(Component.IDatabaseClient) private readonly databaseClient: IDatabaseClient,
    @inject(Component.OfferController) private readonly offerController: IController,
    @inject(Component.UserController) private userController: IController,
    @inject(Component.ExceptionFilter) private readonly exceptionFilter: IExceptionFilter,
    @inject(Component.CommentController) private readonly commentController: IController,
  ) {
    this.expressApplication = express();
  }


  private async _initMiddleware() {
    this.expressApplication.use(express.json());
    this.expressApplication.use(
      '/upload',
      express.static(this.settings.get('UPLOAD_DIRECTORY'))
    );
  }

  private async _initServer() {
    this.logger.info('Сервер инициализируется');

    const port = this.settings.get('PORT');
    this.expressApplication.listen(port);

    this.logger.info(`Сервер успешно стартовал на ${port} порту`);
  }

  private async _initRoutes() {
    this.logger.info('Контроллеры инициализируются');
    this.expressApplication.use('/offers', this.offerController.router);
    this.expressApplication.use('/users', this.userController.router);
    this.expressApplication.use('/comments', this.commentController.router);
    this.logger.info('Контроллеры успешно инициализированы');
  }

  private async _initExceptionFilters() {
    this.expressApplication.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

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
    await this._initRoutes();
    await this._initMiddleware();
    await this._initExceptionFilters();
    await this._initServer();
  }
}
