import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardDataService } from './dashboard-data.service';
import { DashboardDataController } from './dashboard-data.controller';

import { Product } from '../entities/product.entity';
import { Transaction } from '../entities/transaction.entity';
import { ExchangeRate } from '../entities/exchange-rate.entity';
import { Warehouse } from '../entities/warehouse.entity';
import { Franchise } from '../entities/franchise.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Transaction,
      ExchangeRate,
      Warehouse,
      Franchise,
    ]),
  ],
  controllers: [DashboardDataController],
  providers: [DashboardDataService],
})
export class DashboardDataModule {}
