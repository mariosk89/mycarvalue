import { DataSource, DataSourceOptions } from 'typeorm';
import { Report } from './reports/report.entity';
import { User } from './users/user.entity';

export const appDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  entities: ['**/*.entity.ts'],
  migrations: [__dirname + '/migrations/*.ts'],
} as DataSourceOptions);