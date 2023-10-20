import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type SettingsSchema = {
  PORT: number;
  SALT: string;
  DB_HOST: string;
}

export const settingsSchema = convict<SettingsSchema>({
  PORT: {
    doc: 'Номер порта, на котором приложение ожидает подключений',
    format: 'port',
    env: 'PORT',
    default: 4055
  },
  SALT: {
    doc: 'Соль',
    format: String,
    env: 'SALT',
    default: '0'
  },
  DB_HOST: {
    doc: 'Адрес сервера баз данных',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  }
});
