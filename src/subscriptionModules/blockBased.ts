import { ApiPromise} from '@polkadot/api';
import { Extrinsic, Header } from '@polkadot/types/interfaces';
import { extractBidInfoFromExtrinsic, isAuctionsBidExtrinsic, isAuctionsNewAuctionExtrinsic } from '../utils';
import { ISubscriptionModule, SubscriptionModuleConstructorParams } from './ISubscribscriptionModule';
import { LoggerSingleton } from '../logger';
import { IPersister } from '../persister/IPersister';
import { AuctionExtrinsicData } from '../types';

export class BlockBased implements ISubscriptionModule {
    private readonly api: ApiPromise
    private readonly networkId: string
    private readonly persister: IPersister
    private readonly logger = LoggerSingleton.getInstance()

    constructor(params: SubscriptionModuleConstructorParams) {
        this.api = params.api
        this.networkId = params.networkId
        this.persister = params.persister
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

        if(isAuctionsBidExtrinsic(extrinsic)) {
          this._auctionsBidExtrinsicHandler(extrinsic, header)
        }

        if(isAuctionsNewAuctionExtrinsic(extrinsic)) {
          this._auctionsNewAuctionExtrinsicHandler(extrinsic, hash)
        }

      })

    }

    private _auctionsBidExtrinsicHandler = async (extrinsic: Extrinsic, header: Header): Promise<void> =>{
      this.logger.info(`detected new auctions > bid extrinsic`)
      this.logger.info(`raw: ${JSON.stringify(extrinsic.toHuman())}`)
      const blockNumber = header.number.unwrap()
      const timestamp = await this.api.query.timestamp.now() //TODO better to get it from the block itself
      const bidInfo = extractBidInfoFromExtrinsic(extrinsic)
      this.logger.info(`processed: ${JSON.stringify( {blockNumber,timestamp,networkId: this.networkId,...bidInfo} )}`)
      this._notifyNewAuctionsBid({
        ...bidInfo,
        section:'auctions',
        method:'bid',
        networkId: this.networkId,
        blockNumber:blockNumber.toNumber(),
        timestamp:timestamp.toNumber()
      })
    }

    private _auctionsNewAuctionExtrinsicHandler = async (extrinsic: Extrinsic, blockHash: string): Promise<void> =>{
      this.logger.info(`detected new auctions > newAuction extrinsic: ${JSON.stringify(extrinsic.toHuman())}`)
    }

    private _notifyNewAuctionsBid = async (data: AuctionExtrinsicData): Promise<void> => {
      this.logger.debug(`Delegating to the Notifier the New Auctions > Bid Extrnsic notification...`)
      this.logger.debug(JSON.stringify(data))
      this.persister.newAuctionsBidExtrinsic(data)
    }
}
