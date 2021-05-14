import { InputPersisterConfig } from "../types";
import { DbPersister } from "./dbPersister";

export class PersisterFactory {
  constructor(private readonly cfg: InputPersisterConfig){}

  makePersister = (): DbPersister => {
    return new DbPersister(this.cfg.mongo)
  }
}