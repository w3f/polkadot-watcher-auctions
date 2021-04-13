import { Schema } from "mongoose";

export const AuctionsBidsAcceptedSchema = new Schema({
  who: String,
  paraId: Number,
  amount: Number,
  firstSlot: Number,
  lastSlot: Number,
});
