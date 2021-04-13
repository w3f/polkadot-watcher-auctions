import { AuctionData } from "../types";

export interface IPersister {
  newAuctionsBidAccepted(data: AuctionData): Promise<string>;
}