import { InputPersisterConfig } from "../types";
import { DbPersister } from "./dbPersister";

export class PersisterFactory {
  constructor(private readonly cfg: InputPersisterConfig){}

  makePersister = () => {
    return new DbPersister(this.cfg.mongo)
  }
}