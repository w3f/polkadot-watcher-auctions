import { Logger } from "@w3f/logger";
import { DbPersister } from "./dbPersister";

export class PersisterFactory {
  constructor(private readonly cfg: any, private readonly logger: Logger){}

  makePersister = () => {
    return new DbPersister(this.cfg,this.logger)
  }
}