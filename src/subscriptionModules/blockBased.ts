import { ApiPromise} from '@polkadot/api';
import { Logger } from '@w3f/logger';
import { Extrinsic, Header } from '@polkadot/types/interfaces';
import { isAuctionsBidExtrinsic, isAuctionsNewAuctionExtrinsic } from '../utils';
import { ISubscriptionModule, SubscriptionModuleConstructorParams } from './ISubscribscriptionModule';

export class BlockBased implements ISubscriptionModule {
    private readonly api: ApiPromise
    private readonly logger: Logger

    constructor(params: SubscriptionModuleConstructorParams) {
        this.api = params.api
        this.logger = params.logger
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

        if(!isAuctionsBidExtrinsic(extrinsic)) {
          this._auctionsBidExtrinsicHandler(extrinsic, hash)
        }

        if(!isAuctionsNewAuctionExtrinsic(extrinsic)) {
          this._auctionsNewAuctionExtrinsicHandler(extrinsic, hash)
        }

      })

    }

    private _auctionsBidExtrinsicHandler = async (extrinsic: Extrinsic, blockHash: string): Promise<void> =>{
      this.logger.info(`detected new AuctionsBidExtrinsic: ${JSON.stringify(extrinsic.toHuman())}`)
      const { signer, method: { args } } = extrinsic;
    }

    private _auctionsNewAuctionExtrinsicHandler = async (extrinsic: Extrinsic, blockHash: string): Promise<void> =>{
      this.logger.info(`detected new AuctionsNewAuctionExtrinsic: ${JSON.stringify(extrinsic.toHuman())}`)
      const { signer, method: { args } } = extrinsic;
    }
}
