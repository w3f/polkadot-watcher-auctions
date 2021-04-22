import { createLogger, Logger  } from '@w3f/logger';
import { InputConfig } from './types';

export class LoggerSingleton {
  private static instance: Logger;

  public static getInstance(): Logger {
      if (!LoggerSingleton.instance) {
        LoggerSingleton.instance = createLogger();
      }

      return LoggerSingleton.instance;
  }

  public static initFromConfig(cfg: InputConfig): void {
    if (!LoggerSingleton.instance) {
      let logLevel = cfg.logLevel
      if(cfg.debug.enabled) logLevel = 'debug'
      LoggerSingleton.instance = createLogger(logLevel);
    }
  }
}