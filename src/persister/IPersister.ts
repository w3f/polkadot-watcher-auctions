/* eslint-disable @typescript-eslint/interface-name-prefix */

import { AuctionData, AuctionExtrinsicData, CrowdloanEventData } from "../types";

export interface IPersister {
  newAuctionsBidAccepted(data: AuctionData): Promise<string>;
  newAuctionsBidExtrinsic(data: AuctionExtrinsicData): Promise<string>;
  newCrowdloanContributedEvent(data: CrowdloanEventData): Promise<string>;
}