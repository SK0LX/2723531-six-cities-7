import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

type RestSchema = {
  PORT: number;
  DB_HOST: string;
  SALT: string;
};
export default RestSchema;

export const configRestSchema = convict<RestSchema>({
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
  },
});
