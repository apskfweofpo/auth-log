import { User } from "../users/entities/user.entity";

export default () => ({
    port: parseInt(process.env.PORT, 10) || 5000,
    database: {
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
      username:  process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User],
      synchronize: true,
    }
  });