import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../entities/product.entity';
import { Transaction, TransactionType } from '../entities/transaction.entity';
import { ExchangeRate } from '../entities/exchange-rate.entity';
import { Warehouse } from '../entities/warehouse.entity';
import { Franchise } from '../entities/franchise.entity';

@Injectable()
export class DashboardDataService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    @InjectRepository(ExchangeRate)
    private readonly exchangeRateRepo: Repository<ExchangeRate>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>,
    @InjectRepository(Franchise)
    private readonly franchiseRepo: Repository<Franchise>,
  ) {}

  async getMetrics(tenantId: string, branchId: string) {
    const salesTx = await this.transactionRepo.find({
      where: { tenantId, branchId, type: TransactionType.SALE },
    });
    const salesTotal = salesTx.reduce((sum, tx) => sum + Number(tx.total), 0);

    const purchasesTx = await this.transactionRepo.find({
      where: { tenantId, branchId, type: TransactionType.PURCHASE },
    });
    const purchasesTotal = purchasesTx.reduce((sum, tx) => sum + Number(tx.total), 0);

    const productsList = await this.productRepo.find({
      where: { tenantId, branchId },
    });
    const stockValue = productsList.reduce((sum, p) => sum + Number(p.stock) * Number(p.price), 0);
    const stockCount = productsList.reduce((sum, p) => sum + Number(p.stock), 0);

    const bcvRate = await this.exchangeRateRepo.findOne({
      where: { tenantId, branchId },
    });
    const rate = bcvRate ? Number(bcvRate.rate) : 36.40;
    const bcvDate = bcvRate ? bcvRate.bcvDate : null;

    return {
      salesTotal,
      purchasesTotal,
      bankBalanceUSD: 14580.50,
      bankBalanceBs: 14580.50 * rate,
      stockCount,
      stockValue,
      rate,
      bcvDate,
    };
  }

  async getProducts(tenantId: string, branchId: string) {
    return this.productRepo.find({
      where: { tenantId, branchId },
      order: { code: 'ASC' },
    });
  }

  async getTransactions(tenantId: string, branchId: string, type?: TransactionType) {
    const where: any = { tenantId, branchId };
    if (type) {
      where.type = type;
    }
    return this.transactionRepo.find({
      where,
      order: { date: 'DESC', docNumber: 'DESC' },
    });
  }

  async getExchangeRates(tenantId: string, branchId: string) {
    return this.exchangeRateRepo.find({
      where: { tenantId, branchId },
    });
  }

  async getWarehouses(tenantId: string, branchId: string) {
    return this.warehouseRepo.find({
      where: { tenantId, branchId },
      order: { code: 'ASC' },
    });
  }

  async getFranchises(tenantId: string, branchId: string) {
    return this.franchiseRepo.find({
      where: { tenantId, branchId },
      order: { code: 'ASC' },
    });
  }

  async syncExchangeRate(tenantId: string, branchId: string) {
    let newRate: number | null = null;
    let bcvDate = new Date().toISOString();
    let sourceUsed = 'DolarVZLA';

    try {
      const response = await fetch('https://rates.dolarvzla.com/bcv/current.json', {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.current && data.current.usd) {
          newRate = Number(data.current.usd);
          bcvDate = data.current.date || new Date().toISOString();
        }
      }
    } catch (e) {
      console.warn('Error fetching from DolarVZLA, trying fallback...', e.message);
    }

    if (!newRate) {
      try {
        sourceUsed = 'DolarApi';
        const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(10000),
        });

        if (response.ok) {
          const data = await response.json();
          newRate = Number(data.promedio);
          bcvDate = data.fechaActualizacion || new Date().toISOString();
        }
      } catch (e) {
        console.error('Error fetching fallback from DolarApi:', e.message);
      }
    }

    if (!newRate || isNaN(newRate)) {
      return {
        success: false,
        message: 'No se pudo obtener la tasa oficial del BCV de ninguna fuente.',
      };
    }

    try {
      // Find existing USD/Bs. BCV rate
      let exchangeRate = await this.exchangeRateRepo.findOne({
        where: { tenantId, branchId, name: 'USD/Bs. BCV' },
      });

      if (!exchangeRate) {
        exchangeRate = await this.exchangeRateRepo.findOne({
          where: { tenantId, branchId },
        });
      }

      if (exchangeRate) {
        exchangeRate.rate = newRate;
        exchangeRate.bcvDate = bcvDate;
        await this.exchangeRateRepo.save(exchangeRate);
      } else {
        exchangeRate = this.exchangeRateRepo.create({
          name: 'USD/Bs. BCV',
          rate: newRate,
          symbol: 'Bs.',
          tenantId,
          branchId,
          bcvDate,
        });
        await this.exchangeRateRepo.save(exchangeRate);
      }

      return {
        success: true,
        rate: newRate,
        bcvDate,
        message: `Tasa BCV sincronizada con éxito (${newRate.toFixed(4)} Bs/$)`,
      };
    } catch (error) {
      console.error('Error saving synced BCV rate:', error);
      return {
        success: false,
        message: `Error al guardar la tasa en la base de datos: ${error.message}`,
      };
    }
  }
}
