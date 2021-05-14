/* eslint-disable @typescript-eslint/interface-name-prefix */

import { AuctionData, AuctionExtrinsicData } from "../types";

export interface IPersister {
  newAuctionsBidAccepted(data: AuctionData): Promise<string>;
  newAuctionsBidExtrinsic(data: AuctionExtrinsicData): Promise<string>;
}