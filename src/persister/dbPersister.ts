import Database from "../db";
import { AuctionData } from "../types";
import { IPersister } from "./IPersister";

export class DbPersister implements IPersister {
  private db: Database

  constructor(private readonly config, private readonly logger){
    this.initDb()
  }
  
  private initDb = async () => {
    this.db = await Database.create(this.config.db.mongo.uri);
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