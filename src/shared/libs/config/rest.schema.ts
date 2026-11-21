import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

type RestSchema = {
  PORT: number;
  DB_HOST: string;
  SALT: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: number;
  DB_NAME: string;
  UPLOAD_DIRECTORY: string;
  PUBLIC_URL: string;
};
export default RestSchema;

export const configRestSchema = convict<RestSchema>({
  UPLOAD_DIRECTORY: {
    doc: 'Каталог загруженных аватаров',
    format: String,
    env: 'UPLOAD_DIRECTORY',
    default: './uploads/avatars',
  },
  PUBLIC_URL: {
    doc: 'Публичный адрес REST-сервера, если он отличается от localhost',
    format: (value: unknown) => {
      if (value === '') {
        return;
      }

      const error = new Error('PUBLIC_URL должен содержать адрес сервера с протоколом HTTP или HTTPS.');
      if (typeof value !== 'string') {
        throw error;
      }

      let url: URL;
      try {
        url = new URL(value);
      } catch {
        throw error;
      }

      if ((url.protocol !== 'http:' && url.protocol !== 'https:') ||
        (value !== url.origin && value !== `${url.origin}/`)) {
        throw error;
      }
    },
    env: 'PUBLIC_URL',
    default: '',
  },
  DB_USER: {
    doc: 'Пользователь MongoDB',
    format: String,
    env: 'DB_USER',
    default: null,
  },
  DB_PASSWORD: {
    doc: 'Пароль пользователя MongoDB',
    format: String,
    env: 'DB_PASSWORD',
    default: null,
  },
  DB_PORT: {
    doc: 'Порт MongoDB',
    format: 'port',
    env: 'DB_PORT',
    default: null,
  },
  DB_NAME: {
    doc: 'Название базы данных',
    format: String,
    env: 'DB_NAME',
    default: null,
  },
  PORT: {
    doc: 'Порт приложения',
    format: 'port',
    env: 'PORT',
    default: null,
  },
  DB_HOST: {
    doc: 'IP-адрес сервера базы данных',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: null,
  },
  SALT: {
    doc: 'Соль для хеширования паролей',
    format: (value: unknown) => {
      if (typeof value !== 'string' || !value.trim()) {
        throw new Error('SALT должна быть непустой строкой.');
      }
    },
    env: 'SALT',
    default: null,
  }
});
