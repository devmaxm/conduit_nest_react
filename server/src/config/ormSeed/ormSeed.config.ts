import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import ormConfig from "@app/config/orm/orm.config";

const typeormSeedConfig: PostgresConnectionOptions = {
  ...ormConfig,
  migrations: [__dirname + '/../../seeds/**/*{.ts,.js}']
};

export default typeormSeedConfig;
