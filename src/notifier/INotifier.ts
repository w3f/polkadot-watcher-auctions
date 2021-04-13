import { AuctionData } from "../types";

export interface Notifier {
  newAuctionsBidAccepted(data: AuctionData): Promise<string>;
}