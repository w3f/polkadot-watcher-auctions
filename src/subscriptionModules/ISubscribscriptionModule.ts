/* eslint-disable @typescript-eslint/interface-name-prefix */

import { ApiPromise } from "@polkadot/api";
import { IPersister } from "../persister/IPersister";

export interface ISubscriptionModule{
  subscribe(): Promise<void>;
}

export interface SubscriptionModuleConstructorParams {
  api: ApiPromise;
  networkId: string;
  persister: IPersister;
}