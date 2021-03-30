import { ApiPromise, WsProvider } from '@polkadot/api';
import { Logger } from '@w3f/logger';
import { Text } from '@polkadot/types/primitive';
import {
    InputConfig, SubscriberConfig
} from './types';
import { BlockBased } from './subscriptionModules/blockBased';
import { SubscriptionModuleConstructorParams } from './subscriptionModules/ISubscribscriptionModule';

export class Subscriber {
    private chain: Text;
    private api: ApiPromise;
    private networkId: string;
    private endpoint: string;
    private logLevel: string;
    private config: SubscriberConfig;

    private blockBased: BlockBased;

    constructor(
        cfg: InputConfig,
        private readonly logger: Logger) {
        this.endpoint = cfg.endpoint;
        this.logLevel = cfg.logLevel;

        this._initSubscriberConfig(cfg)
    }

    private _initSubscriberConfig = (cfg: InputConfig): void => {
      this.config = cfg.subscriber
    }

    public start = async (): Promise<void> => {
        await this._initAPI();
        this._initModules()

        if(this.logLevel === 'debug') await this._triggerDebugActions()

        this.config.modules?.transferExtrinsic?.enabled != false && this.blockBased.subscribe()
    }

    private _initAPI = async (): Promise<void> =>{
        const provider = new WsProvider(this.endpoint);
        provider.on('error', error => {
          if(this.api == undefined) {
            this.logger.error(JSON.stringify("initAPI error:"+JSON.stringify(error)))
            process.exit(1)
          }
        })
        this.api = await ApiPromise.create({ provider });
        
        this.chain = await this.api.rpc.system.chain();
        this.networkId = this.chain.toString().toLowerCase()
        const [nodeName, nodeVersion] = await Promise.all([
            this.api.rpc.system.name(),
            this.api.rpc.system.version()
        ]);
        this.logger.info(
            `You are connected to chain ${this.chain} using ${nodeName} v${nodeVersion}`
        );
    }

    private  _triggerDebugActions = async (): Promise<void> => {
      this.logger.debug('debug mode active')
    }

    /*to agevolate the tests*/
    private _initModules = (): void => {
      const subscriptionModuleConfig: SubscriptionModuleConstructorParams = {
        api: this.api,
        networkId: this.networkId,
        config: this.config,
        logger: this.logger
      }

      this.blockBased = new BlockBased(subscriptionModuleConfig)
    }

}
