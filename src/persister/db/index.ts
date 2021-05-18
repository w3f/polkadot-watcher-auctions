import mongoose from "mongoose";

import {
  AuctionsBidExtrinsicSchema,
  AuctionsBidAcceptedSchema
} from "./models";
import { LoggerSingleton } from '../../logger'
import { AuctionData, AuctionExtrinsicData } from "../../types";

// Sets a global configuration to silence mongoose deprecation warnings.
(mongoose as any).set("useFindAndModify", false);

export default class Db {
  private auctionsBidAcceptedModel;
  private auctionsBidExtrinsicsModel;
  private readonly logger = LoggerSingleton.getInstance()

  constructor() {
    this.auctionsBidAcceptedModel = mongoose.model("AuctionsBidsAccepted", AuctionsBidAcceptedSchema)
    this.auctionsBidExtrinsicsModel = mongoose.model("AuctionsBidExtrinsic", AuctionsBidExtrinsicSchema)
  }

  static async create(uri = "mongodb://localhost:27017/auction"): Promise<Db> {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const logger = LoggerSingleton.getInstance()

    return new Promise((resolve, reject) => {
      mongoose.connection.once("open", async () => {
        logger.info(`Established a connection to MongoDB.`);
        const db = new Db();
        resolve(db);
      });

      mongoose.connection.on("error", (err) => {
        logger.error(`MongoDB connection issue: ${err}`);
        reject(err);
      });
    });
  }

  async setNewBidAccepted(bid: AuctionData): Promise<boolean> {
    const newBid = new this.auctionsBidAcceptedModel({
      networkId: bid.networkId,
      who: bid.who,
      paraId: bid.paraId.toNumber(),
      amount: bid.amount.toNumber(),
      firstSlot: bid.firstSlot.toNumber(),
      lastSlot: bid.lastSlot.toNumber(),
      blockNumber: bid.blockNumber,
      timestamp: bid.timestamp
    }) 
    this.logger.info(`Saving the New Bid Accepted Event into the db:`)
    this.logger.info(`${newBid}`)
    return newBid.save()
  }

  async setNewBidExtrinsic(bid: AuctionExtrinsicData): Promise<boolean> {
    const newBid = new this.auctionsBidExtrinsicsModel({
      section: bid.section,
      method: bid.method,
      networkId: bid.networkId,
      who: bid.who,
      paraId: bid.paraId.toNumber(),
      auctionIndex: bid.auctionIndex.toNumber(),
      amount: bid.amount.toNumber(),
      firstSlot: bid.firstSlot.toNumber(),
      lastSlot: bid.lastSlot.toNumber(),
      blockNumber: bid.blockNumber,
      timestamp: bid.timestamp
    }) 
    this.logger.info(`Saving the New Bid Extrinsic into the db:`)
    this.logger.info(`${newBid}`)
    return newBid.save()
  }


}
