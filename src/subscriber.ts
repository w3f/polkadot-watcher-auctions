import { ApiPromise, WsProvider } from '@polkadot/api';
import { LoggerSingleton } from './logger';
import { Text } from '@polkadot/types/primitive';
import {
    InputConfig, InputSubscriberConfig
} from './types';
import { BlockBased } from './subscriptionModules/blockBased';
import { SubscriptionModuleConstructorParams } from './subscriptionModules/ISubscribscriptionModule';
import { IPersister } from './persister/IPersister';
import { EventBased } from './subscriptionModules/eventBased';

export class Subscriber {
    private chain: Text;
    private api: ApiPromise;
    private networkId: string;
    private endpoint: string;
    private logLevel: string;
    private subscriberConfig: InputSubscriberConfig; 
    private readonly logger = LoggerSingleton.getInstance()

    private blockBased: BlockBased;
    private eventBased: EventBased;

    constructor(
        config: InputConfig,
        private readonly persister: IPersister) {
        this.endpoint = config.endpoint;
        this.logLevel = config.logLevel;
        this.subscriberConfig = config.subscriber
    }

    public start = async (): Promise<void> => {
        await this._initAPI();
        this._initModules()

        if(this.logLevel === 'debug') await this._triggerDebugActions()

        this.subscriberConfig.modules?.block?.enabled != false && this.blockBased.subscribe()
        this.subscriberConfig.modules?.event?.enabled != false && this.eventBased.subscribe()
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
        persister: this.persister,
      }

      this.blockBased = new BlockBased(subscriptionModuleConfig)
      this.eventBased = new EventBased(subscriptionModuleConfig)
    }

}
