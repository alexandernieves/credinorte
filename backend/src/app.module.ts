import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Entities
import { Tenant } from './entities/tenant.entity';
import { Branch } from './entities/branch.entity';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { Warehouse } from './entities/warehouse.entity';
import { Transaction } from './entities/transaction.entity';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { Franchise } from './entities/franchise.entity';
import { RememberToken } from './entities/remember-token.entity';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { DashboardDataModule } from './dashboard-data/dashboard-data.module';

@Module({
  imports: [
    AuthModule,
    SeedModule,
    DashboardDataModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_DATABASE', 'creditnorte'),
        entities: [
          Tenant,
          Branch,
          User,
          Product,
          Warehouse,
          Transaction,
          ExchangeRate,
          Franchise,
          RememberToken,
        ],
        synchronize: true, // Auto create/update schema (recommended for monolith dev)
        ssl: config.get<string>('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      }),
    }),
    // TypeORM Feature modules for seeding/routing can be added here
    TypeOrmModule.forFeature([
      Tenant,
      Branch,
      User,
      Product,
      Warehouse,
      Transaction,
      ExchangeRate,
      Franchise,
      RememberToken,
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
