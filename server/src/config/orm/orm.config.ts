import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from "@app/config/env.config";

const typeormConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [__dirname + "/../../**/*.entity{.ts,.js}"],
  synchronize: false,
  migrations: [__dirname + '/../../migrations/**/*{.ts,.js}'],
};

export default typeormConfig;
