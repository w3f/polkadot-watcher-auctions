import mongoose from "mongoose";

import {
  AuctionsBidsAcceptedSchema
} from "./models";
import { createLogger } from '@w3f/logger';
import { AuctionData } from "../types";

// Sets a global configuration to silence mongoose deprecation warnings.
(mongoose as any).set("useFindAndModify", false);

export default class Db {
  private auctionsBidsAcceptedModel;
  private readonly logger = createLogger()

  constructor() {
    this.auctionsBidsAcceptedModel = mongoose.model("AuctionsBidsAccepted", AuctionsBidsAcceptedSchema)
  }

  static async create(uri = "mongodb://localhost:27017/auctions"): Promise<Db> {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const logger = createLogger()

    return new Promise((resolve, reject) => {
      mongoose.connection.once("open", async () => {
        logger.info(`Established a connection to MongoDB.`);
        const db = new Db();
        // Initialize lastNominatedEraIndex if it's not already set.
        resolve(db);
      });

      mongoose.connection.on("error", (err) => {
        logger.error(`MongoDB connection issue: ${err}`);
        reject(err);
      });
    });
  }

  async setNewBid(bid: AuctionData): Promise<boolean> {
    const newBid = new this.auctionsBidsAcceptedModel({
      who: bid.who,
      paraId: bid.paraId.toNumber(),
      amount: bid.paraId.toNumber(),
      firstSlot: bid.paraId.toNumber(),
      lastSlot: bid.paraId.toNumber()
    })
    this.logger.info(`Saving the New Bid into the db:`)
    this.logger.info(`${newBid}`)
    return newBid.save()
  }


}
