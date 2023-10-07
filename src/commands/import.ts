import {CliCommandInterface} from './cli-command.js';
import TSVFileReader from '../file-reader/tsv-file-reader.js';
import chalk from 'chalk';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  public execute(filename: string): void {
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.log(fileReader.parseData());
    } catch (err) {
      console.log(`${chalk.redBright(`ERROR! Can't read the file: ${(err as Error).message}`)}`);
    }
  }
}