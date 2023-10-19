import {createWriteStream, WriteStream} from 'node:fs';
import os from 'os';

export default class FileWriter {
  private stream: WriteStream;

  constructor(public readonly filename: string) {
    this.stream = createWriteStream(this.filename, {
      flags: 'w',
      encoding: 'utf8',
      highWaterMark: 2 ** 16,
      autoClose: true,
    });
  }

  public async write(row: string): Promise<void> {
    if (this.stream.write(`${row}${os.EOL}`)) {
      return Promise.resolve();
    } else {
      return new Promise((resolve) => {
        this.stream.once('drain', () => resolve());
      });
    }
  }
}
