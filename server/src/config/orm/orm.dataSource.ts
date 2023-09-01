import { DataSource } from "typeorm";
import typeormConfig from "@app/config/orm/orm.config";

export default new DataSource(typeormConfig)