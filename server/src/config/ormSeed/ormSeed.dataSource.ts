import { DataSource } from "typeorm";
import typeormSeedConfig from "@app/config/ormSeed/ormSeed.config";

export default new DataSource(typeormSeedConfig)