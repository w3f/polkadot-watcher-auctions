import express from 'express';
import { Config } from '@w3f/config';
import { LoggerSingleton } from '../logger'
import { Subscriber } from '../subscriber';
import { InputConfig } from '../types';
import { PersisterFactory } from '../persister/PersisterFactory';

export const startAction = async (cmd): Promise<void> =>{
    const cfg = new Config<InputConfig>().parse(cmd.config);

    const server = express();
    server.get('/healthcheck',
        async (req: express.Request, res: express.Response): Promise<void> => {
            res.status(200).send('OK!')
        })
    server.listen(cfg.port);

    LoggerSingleton.initFromConfig(cfg)

    const persister = new PersisterFactory(cfg.persister).makePersister()

    const subscriber = new Subscriber(cfg,persister);
    await subscriber.start();
}
