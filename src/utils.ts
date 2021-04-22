import fs, { WriteStream } from 'fs';
import { Logger } from '@w3f/logger';
import { DeriveAccountRegistration } from '@polkadot/api-derive/accounts/types';
import { Extrinsic, Event, ParaId, Balance, LeasePeriod } from '@polkadot/types/interfaces';
import { AuctionData } from './types';

export const isDirEmpty = (path: string): boolean =>{
  return fs.readdirSync(path).length === 0
}

export const isDirExistent = (path: string): boolean =>{
  return fs.existsSync(path)
}

export const makeDir = (path: string): void =>{
  fs.mkdirSync(path)
}

export const getFileNames = (sourceDir: string, logger: Logger): string[] =>{

  let names = []
  try {
    names = fs.readdirSync(sourceDir)
  } catch (error) {
    logger.error(error)
  } 
  return names
}

export const deleteFile = (filePath: string, logger: Logger): void =>{
    
  try {
    fs.unlinkSync(filePath)
    logger.info('deleted ' + filePath)
  } catch(err) {
    logger.error(err)
  }
}

export const initFile = (exportDir: string,fileName: string,logger: Logger): WriteStream => {

  const filePath = `${exportDir}/${fileName}`;
  const file = fs.createWriteStream(filePath);
  file.on('error', (err) => { logger.error(err.stack) });

  return file
}

export const closeFile = (file: WriteStream): Promise<void> => {
  return new Promise(resolve => {
    file.on("close", resolve);
    file.close();
  });
}

export const asyncForEach = async < T extends {} > (array: Array<T>, callback: (arg0: T, arg1: number, arg2: Array<T>) => void): Promise<void> =>{
  for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
  }
}

export const isAuctionsBidExtrinsic = (extrinsic: Extrinsic): boolean => {
  const { method: { method, section } } = extrinsic;
  return section == 'auctions' && method == 'bid' 
}

export const isAuctionsNewAuctionExtrinsic = (extrinsic: Extrinsic): boolean => {
  const { method: { method, section } } = extrinsic;
  return section == 'auctions' && method == 'new_auction' 
}

export const isAuctionBidAcceptedEvent = (event: Event): boolean => {
  const { method, section } = event;
  return section == 'auctions' && method == 'BidAccepted';
}

export const extractBidAcceptedInfoFromEvent = (event: Event): AuctionData =>{
  const who = event.data[0].toString()
  const paraId = event.data[1] as unknown as ParaId
  const amount = event.data[2] as unknown as Balance
  const firstSlot = event.data[3] as unknown as LeasePeriod
  const lastSlot = event.data[4] as unknown as LeasePeriod

  return {who,paraId,amount,firstSlot,lastSlot}
}

export const delayFunction = (ms: number, fn: () => void): Promise<void> =>{
  return new Promise( resolve => setTimeout( () => { fn(); resolve;}, ms) );
}

export const delay = (ms: number): Promise<void> =>{
  return new Promise( resolve => setTimeout(resolve, ms) );
}