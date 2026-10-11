import {once} from 'node:events';
import chalk from 'chalk';
import type {CommandInterface} from './command.interface.js';
import {TSVFileReader} from '../../shared/libs/file-reader/index.js';
import {createOffer, getErrorMessage} from '../../shared/helpers/index.js';

export class ImportCommand implements CommandInterface {
  public getName(): string {
    return '--import';
  }

  private async onImportedLine(line: string, lineNumber: number): Promise<void> {
    let offer;

    try {
      offer = createOffer(line);
    } catch (error: unknown) {
      throw new Error(`Строка ${lineNumber}: ${getErrorMessage(error)}`);
    }

    const writeSuccess = process.stdout.write(`${chalk.yellow(JSON.stringify(offer))}\n`);

    if (!writeSuccess) {
      await once(process.stdout, 'drain');
    }
  }

  private onCompleteImport(count: number): void {
    console.info(chalk.green(`Импорт завершён. Предложений: ${count}.`));
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;

    if (parameters.length !== 1 || !filename?.trim()) {
      console.error(chalk.red('Укажите путь к TSV-файлу: --import <path>.'));
      process.exitCode = 1;
      return;
    }

    const reader = new TSVFileReader(filename.trim());
    reader.on('line', (
      line: string,
      lineNumber: number,
      resolve: () => void,
      reject: (error: unknown) => void,
    ) => {
      this.onImportedLine(line, lineNumber).then(resolve, reject);
    });
    reader.on('end', (count: number) => this.onCompleteImport(count));

    try {
      await reader.read();
    } catch (error: unknown) {
      process.exitCode = 1;
      console.error(chalk.red(`Не удалось импортировать файл: ${filename.trim()}`));
      console.error(chalk.red(getErrorMessage(error)));
    } finally {
      reader.removeAllListeners();
    }
  }
}
