import {CliCommandInterface} from './cli-command.js';
import FileReader from '../file-helpers/file-reader.js';
import chalk from 'chalk';
import { parseOffer } from '../helpers/offers.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  public async execute(filename: string): Promise<void> {
    const fileReader = new FileReader(filename.trim());
    fileReader.on('row', (line: string) => {
      const offer = parseOffer(line);
      console.log(offer);
    });
    fileReader.on('end', (count: number) => console.log(`${count} rows successfully imported`));
    try {
      await fileReader.read();
    } catch (err) {
      console.log(`${chalk.redBright(`ERROR! Can't read the file: ${(err as Error).message}`)}`);
    }
  }
}
