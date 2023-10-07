import { CliCommandInterface } from './cli-command.js';
import {MockData} from '../types/mock-data.js';
import FileWriter from '../file-helpers/file-writer.js';
import fetch from 'node-fetch';
import { generateOffer } from '../helpers/offers.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: MockData;

  public async execute(...parameters:string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);
    try {
        const response = await fetch(url);
        if (response.ok) {
          this.initialData = await response.json() as MockData;
        } else {
          throw new Error('Failed to fetch data');
        }
    } catch {
      console.log(`Can't get data from ${url}`);
    }
    const fileWriter = new FileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await fileWriter.write(generateOffer(this.initialData));
    }

    console.log(`File ${filepath} was successfully created`);
  }
}