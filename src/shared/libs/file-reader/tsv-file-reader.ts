import {EventEmitter} from 'node:events';
import {createReadStream} from 'node:fs';
import type {FileReader} from './file-reader.interface.js';

const CHUNK_SIZE = 16384;

export class TSVFileReader extends EventEmitter implements FileReader {
  constructor(private readonly filename: string) {
    super();
  }

  private async emitLine(line: string, lineNumber: number): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (!this.emit('line', line, lineNumber, resolve, reject)) {
        resolve();
      }
    });
  }

  public async read(): Promise<void> {
    const stream = createReadStream(this.filename, {
      highWaterMark: CHUNK_SIZE,
      encoding: 'utf-8',
    });
    let remainingData = '';
    let lineNumber = 0;
    let importedRowCount = 0;

    const processLine = async (line: string): Promise<void> => {
      lineNumber++;

      if (!line.trim()) {
        return;
      }

      await this.emitLine(line.replace(/\r$/, ''), lineNumber);
      importedRowCount++;
    };

    try {
      for await (const chunk of stream) {
        remainingData += chunk.toString();
        let nextLinePosition = remainingData.indexOf('\n');

        while (nextLinePosition >= 0) {
          const line = remainingData.slice(0, nextLinePosition);
          remainingData = remainingData.slice(nextLinePosition + 1);
          await processLine(line);
          nextLinePosition = remainingData.indexOf('\n');
        }
      }

      if (remainingData.length > 0) {
        await processLine(remainingData);
      }

      this.emit('end', importedRowCount);
    } finally {
      stream.destroy();
    }
  }
}
