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
  section: String,
  method: String,
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

export const CrowdloanContributedEventSchema = new Schema({
  section: String,
  method: String,
  networkId: String,
  paraId: Number,
  who: String,
  amount: Number,
  blockNumber: Number,
  timestamp: Number,
});
