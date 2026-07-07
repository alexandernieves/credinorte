import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';

import { Tenant } from '../entities/tenant.entity';
import { Branch } from '../entities/branch.entity';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Warehouse } from '../entities/warehouse.entity';
import { Transaction } from '../entities/transaction.entity';
import { ExchangeRate } from '../entities/exchange-rate.entity';
import { Franchise } from '../entities/franchise.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tenant,
      Branch,
      User,
      Product,
      Warehouse,
      Transaction,
      ExchangeRate,
      Franchise,
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
