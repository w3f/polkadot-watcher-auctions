import { Schema } from "mongoose";

export const AuctionsBidsAcceptedSchema = new Schema({
  networkId: String,
  paraId: Number,
  who: String,
  amount: Number,
  firstSlot: Number,
  lastSlot: Number,
  blockNumber: Number,
  timestamp: Number,
});
