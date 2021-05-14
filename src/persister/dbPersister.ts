import Database from "./db";
import { AuctionData, InputMongoConfig } from "../types";
import { IPersister } from "./IPersister";
import { LoggerSingleton } from '../logger'

export class DbPersister implements IPersister {
  private db: Database
  private readonly logger = LoggerSingleton.getInstance()

  constructor(private readonly config: InputMongoConfig){
    this.initDb()
  }
  
  private initDb = async (): Promise<void> => {
    this.db = await Database.create(this.config.uri);
  }

  newAuctionsBidAccepted = async (data: AuctionData): Promise<string> => {
    try {
      await this.db.setNewBid(data)
      return ""
    } catch (error) {
      this.logger.error(`could not notify Transfer Event: ${error.message}`);
      return error.message
    }
  }

}