import { ApiPromise} from '@polkadot/api';
import { Logger } from '@w3f/logger';
import {
    SubscriberConfig, Subscribable
} from '../types';
import { Extrinsic, Header } from '@polkadot/types/interfaces';
import { isAuctionsBidExtrinsic } from '../utils';
import { ISubscriptionModule, SubscriptionModuleConstructorParams } from './ISubscribscriptionModule';


export class BlockBased implements ISubscriptionModule {

    private subscriptions = new Map<string,Subscribable>()
    private readonly api: ApiPromise
    private readonly config: SubscriberConfig
    private readonly logger: Logger

    constructor(params: SubscriptionModuleConstructorParams) {
        this.api = params.api
        this.config = params.config
        this.logger = params.logger
        
        this._initSubscriptions()
    }

    private _initSubscriptions = (): void => {
      for (const subscription of this.config.subscriptions) {
        this.subscriptions.set(subscription.address,subscription)
      }
    }  

    public subscribe = async (): Promise<void> => {
      await this._handleNewHeadSubscriptions();
      this.logger.info(`Block Based Module subscribed...`)
    }

    private _handleNewHeadSubscriptions = async (): Promise<void> =>{

      this.api.rpc.chain.subscribeFinalizedHeads(async (header) => {
       
        await this._blocksHandler(header)

      })
    }

    private _blocksHandler = async (header: Header): Promise<void> =>{

      const hash = header.hash.toHex()
      const block = await this.api.rpc.chain.getBlock(hash)
      this.logger.debug(`block:`)
      this.logger.debug(JSON.stringify(block))

      block.block.extrinsics.forEach( async (extrinsic) => {

        if(!isAuctionsBidExtrinsic(extrinsic)) 

        this._auctionsBidExtrinsicHandler(extrinsic, hash)
  
      })

    }

    private _auctionsBidExtrinsicHandler = async (extrinsic: Extrinsic, blockHash: string): Promise<void> =>{
      this.logger.info(`detected new AuctionsBidExtrinsic: ${JSON.stringify(extrinsic)}`)
      
    }
}
