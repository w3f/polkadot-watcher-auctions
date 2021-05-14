import Database from "./db";
import { AuctionData, AuctionExtrinsicData, InputMongoConfig } from "../types";
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
      await this.db.setNewBidAccepted(data)
      return ""
    } catch (error) {
      this.logger.error(`could not persist Auction New Bid Event: ${error.message}`);
      return error.message
    }
  }

  newAuctionsBidExtrinsic = async (data: AuctionExtrinsicData): Promise<string> => {
    try {
      await this.db.setNewBidExtrinsic(data)
      return ""
    } catch (error) {
      this.logger.error(`could not persist Auction Bid Extrinsic: ${error.message}`);
      return error.message
    }
  }

}