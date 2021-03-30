import { ApiPromise } from '@polkadot/api';
import { EraIndex, SessionIndex, BlockNumber, EraRewardPoints, Balance } from '@polkadot/types/interfaces';
import { Compact } from '@polkadot/types';
import { DeriveStakingAccount } from '@polkadot/api-derive/staking/types';

export interface InputConfig {
    logLevel: string;
    debug: DebugConfig;
    port: number;
    endpoint: string;
    exportDir: string;
    endSessionBlockDistance: number;
    bucketUpload: BucketUploadConfig;
    cronjob: CronJobConfig;
    subscriber: SubscriberConfig;
}

interface DebugConfig{
  enabled: boolean;
  forceInitialWrite: boolean;
}

export interface CronJobConfig{
  enabled: boolean;
}

export interface SubscriberConfig {
  subscriptions: Array<Subscribable>;
  modules?: {
    transferEvent?: SubscriptionModuleConfig;
    balanceChange?: SubscriptionModuleConfig;
    transferExtrinsic?: SubscriptionModuleConfig;
  };
}

export interface BucketUploadConfig{
  enabled: boolean;
  gcpServiceAccount: string;
  gcpProject: string;
  gcpBucketName: string;
}

export interface MyDeriveStakingAccount extends DeriveStakingAccount {
  displayName: string;
  voters: number;
  eraPoints?: number;
}

export interface WriteCSVRequest{
  api: ApiPromise;
  network: string; 
  exportDir: string; 
  eraIndex: EraIndex; 
  sessionIndex: SessionIndex; 
  blockNumber: Compact<BlockNumber>;
  totalIssuance?: Balance;
}

export interface WriteNominatorCSVRequest extends WriteCSVRequest{
  nominatorStaking: DeriveStakingAccount[];
}

export interface WriteValidatorCSVRequest extends WriteCSVRequest{
  myValidatorStaking: MyDeriveStakingAccount[];
}

export interface ChainData {
  eraPoints: EraRewardPoints;
  totalIssuance: Balance;
  nominatorStaking: DeriveStakingAccount[];
  myValidatorStaking: MyDeriveStakingAccount[];
}

export interface SubscriptionModuleConfig {
  enabled?: boolean;
  sent?: boolean;
  received?: boolean;
}

export enum TransactionType {
  Received,
  Sent
}

export interface Subscribable {
  name: string;
  address: string;
  transferEvent?: SubscriptionModuleConfig;
  balanceChange?: SubscriptionModuleConfig;
  transferExtrinsic?: SubscriptionModuleConfig;
}

export interface TransactionData extends Subscribable {
  txType?: TransactionType;
  networkId: string;
  hash?: string;
  amount?: Balance;
}

export interface Notifier {
  newTransaction(data: TransactionData): Promise<string>;
  newBalanceChange(data: TransactionData): Promise<string>;
  newTransfer(data: TransactionData): Promise<string>;
}