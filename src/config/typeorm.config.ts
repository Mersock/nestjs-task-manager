import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'nestjs-taks-postgres',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'tasks',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};
