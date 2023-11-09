import {CliCommandInterface} from './cli-command.js';
import FileReader from '../file-helpers/file-reader.js';
import chalk from 'chalk';
import { parseOffer } from '../helpers/offers.js';
import { IUserRepository } from '../modules/user/irepository.js';
import { IOfferRepository } from '../modules/offer/irepository.js';
import { IDatabaseClient } from '../db/idatabase-client.js';
import { ILog } from '../logger/ilog.js';
import ConsoleLog from '../logger/consoleLog.js';
import OfferRepository from '../modules/offer/repository.js';
import UserRepository from '../modules/user/repository.js';
import { OfferModel } from '../modules/offer/entity.js';
import { UserModel } from '../modules/user/entity.js';
import MongoClientService from '../db/mongo-client.js';
import { getConnectionString } from '../helpers/database.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from '../types/consts.js';
import { Offer } from '../types/offer.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private userRepository!: IUserRepository;
  private offerRepository!: IOfferRepository;
  private databaseClient!: IDatabaseClient;
  private readonly logger: ILog;
  private salt!: string;

  constructor() {
    this.execute = this.execute.bind(this);

    this.logger = new ConsoleLog();
    this.offerRepository = new OfferRepository(this.logger, OfferModel);
    this.userRepository = new UserRepository(this.logger, UserModel);
    this.databaseClient = new MongoClientService(this.logger);
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userRepository.findOrCreate({
      ...offer.author,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.offerRepository.create({
      ...offer,
      userId: user.id,
    });
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename, login, password, host, dbname, salt] = parameters;
    const uri = getConnectionString(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new FileReader(filename.trim());
    fileReader.on('row', async (line: string) => {
      const offer = parseOffer(line);
      await this.saveOffer(offer);
    });
    fileReader.on('end', (count: number) => {
      console.log(`${count} rows successfully imported`);
      this.databaseClient.disconnect();
    });
    try {
      await fileReader.read();
    } catch (err) {
      this.logger.error(`${chalk.redBright(`ERROR! Can't read the file: ${(err as Error).message}`)}`);
    }
  }
}
