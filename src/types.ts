import { Balance, ParaId, LeasePeriod } from '@polkadot/types/interfaces';

export interface InputConfig {
    logLevel: string;
    debug: DebugConfig;
    port: number;
    endpoint: string;
    subscriber: InputSubscriberConfig;
    persister: InputPersisterConfig;
}

interface DebugConfig{
  enabled: boolean;
}

export interface InputPersisterConfig {
  mongo: InputMongoConfig;
}

export interface InputMongoConfig {
  uri: string;
}

export interface CronJobConfig{
  enabled: boolean;
}

export interface InputSubscriberConfig {
  modules?: {
    event?: SubscriptionModuleConfig;
    block?: SubscriptionModuleConfig;
  };
}

export interface SubscriptionModuleConfig {
  enabled?: boolean;
}

export interface BidAcceptedInfo {
  paraId: ParaId;
  who: string;
  amount: Balance;
  firstSlot: LeasePeriod;
  lastSlot: LeasePeriod;
}

export interface ExtrinsicBidInfo extends BidAcceptedInfo {
  auctionIndex: ParaId;
}

export interface AuctionData extends BidAcceptedInfo {
  networkId: string;
  blockNumber: number;
  timestamp: number;
}

export interface AuctionExtrinsicData extends ExtrinsicBidInfo {
  section: string;
  method: string;
  networkId: string;
  blockNumber: number;
  timestamp: number;
}