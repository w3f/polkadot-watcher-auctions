import { Schema } from "mongoose";

export const AuctionsBidAcceptedSchema = new Schema({
  networkId: String,
  paraId: Number,
  who: String,
  amount: Number,
  firstSlot: Number,
  lastSlot: Number,
  blockNumber: Number,
  timestamp: Number,
});

export const AuctionsBidExtrinsicSchema = new Schema({
  networkId: String,
  paraId: Number,
  auctionIndex: Number,
  who: String,
  amount: Number,
  firstSlot: Number,
  lastSlot: Number,
  blockNumber: Number,
  timestamp: Number,
});
