import { ISettings } from './isettings.js';
import { ILog } from '../logger/ilog.js';
import {config} from 'dotenv';
import {settingsSchema, SettingsSchema} from './schema.js';
import {inject, injectable} from 'inversify';
import {Component} from '../types/component.js';

@injectable()
export default class Settings implements ISettings<SettingsSchema> {
  private readonly config: SettingsSchema;

  constructor(
    @inject(Component.ILog) private readonly log: ILog
  ) {
    const configOutput = config();

    if (configOutput.error) {
      throw new Error('Ошибка при чтении .env файла');
    }

    settingsSchema.load({});
    settingsSchema.validate({ allowed: 'strict', output: this.log.info });

    this.config = settingsSchema.getProperties();
    this.log.info('.env файл успешно найден');
  }

  public get<T extends keyof SettingsSchema>(key: T): SettingsSchema[T] {
    return this.config[key];
  }
}
