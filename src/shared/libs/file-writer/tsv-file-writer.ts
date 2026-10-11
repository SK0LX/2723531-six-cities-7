import {createWriteStream, WriteStream} from 'node:fs';
import {once} from 'node:events';
import {finished} from 'node:stream/promises';
import type {FileWriter} from './file-writer.interface.js';

export class TSVFileWriter implements FileWriter {
  private readonly stream: WriteStream;
  private streamError: Error | null = null;
  private ended = false;

  constructor(filename: string) {
    this.stream = createWriteStream(filename, {encoding: 'utf-8', flags: 'w'});
    this.stream.on('error', (error: Error) => {
      this.streamError = error;
    });
  }

  public async write(row: string): Promise<void> {
    if (this.streamError) {
      throw this.streamError;
    }

    if (this.ended) {
      throw new Error('Cannot write to a finished file stream.');
    }

    const writeSuccess = this.stream.write(`${row}\n`);

    if (!writeSuccess) {
      await once(this.stream, 'drain');
    }
  }

  public async end(): Promise<void> {
    if (this.streamError) {
      throw this.streamError;
    }

    this.ended = true;
    const completion = finished(this.stream);
    this.stream.end();
    await completion;
  }
}
