import got from 'got';
import chalk from 'chalk';
import type {CommandInterface} from './command.interface.js';
import type {MockServerData} from '../../shared/types/index.js';
import {TSVOfferGenerator} from '../../shared/libs/offer-generator/index.js';
import {TSVFileWriter} from '../../shared/libs/file-writer/index.js';
import {getErrorMessage} from '../../shared/helpers/index.js';

export class GenerateCommand implements CommandInterface {
  private async load(url: string): Promise<MockServerData> {
    return got.get(url, {
      timeout: {request: 10000},
      retry: {limit: 0},
    }).json<MockServerData>();
  }

  private async write(filepath: string, offerCount: number, mockData: MockServerData): Promise<void> {
    const generator = new TSVOfferGenerator(mockData);
    const writer = new TSVFileWriter(filepath);

    try {
      for (let index = 0; index < offerCount; index++) {
        await writer.write(generator.generate());
      }
    } finally {
      await writer.end();
    }
  }

  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    try {
      const [count, filepath, url] = parameters;

      if (parameters.length !== 3 || !filepath?.trim() || !url?.trim()) {
        throw new Error('Укажите аргументы: --generate <n> <filepath> <url>.');
      }

      const offerCount = Number(count);

      if (!/^\d+$/.test(count) || !Number.isSafeInteger(offerCount) || offerCount < 1) {
        throw new Error('Количество предложений должно быть положительным целым числом.');
      }

      const serverUrl = new URL(url);

      if (!['http:', 'https:'].includes(serverUrl.protocol)) {
        throw new Error('Адрес сервера должен начинаться с http:// или https://.');
      }

      const mockData = await this.load(serverUrl.href);
      await this.write(filepath.trim(), offerCount, mockData);
      console.info(chalk.green(`Файл ${filepath.trim()} создан. Предложений: ${offerCount}.`));
    } catch (error: unknown) {
      process.exitCode = 1;
      console.error(chalk.red('Не удалось сгенерировать данные.'));
      console.error(chalk.red(getErrorMessage(error)));
    }
  }
}
