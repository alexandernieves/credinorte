import { Controller, Get, Post, Headers, Query, UseGuards } from '@nestjs/common';
import { DashboardDataService } from './dashboard-data.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionType } from '../entities/transaction.entity';

@Controller('data')
@UseGuards(JwtAuthGuard)
export class DashboardDataController {
  constructor(private readonly dataService: DashboardDataService) {}

  @Get('metrics')
  async getMetrics(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-branch-id') branchId: string,
  ) {
    return this.dataService.getMetrics(tenantId, branchId);
  }

  @Get('products')
  async getProducts(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-branch-id') branchId: string,
  ) {
    return this.dataService.getProducts(tenantId, branchId);
  }

  @Get('transactions')
  async getTransactions(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-branch-id') branchId: string,
    @Query('type') type?: TransactionType,
  ) {
    return this.dataService.getTransactions(tenantId, branchId, type);
  }

  @Get('rates')
  async getRates(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-branch-id') branchId: string,
  ) {
    return this.dataService.getExchangeRates(tenantId, branchId);
  }

  @Post('rates/sync')
  async syncRates(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-branch-id') branchId: string,
  ) {
    return this.dataService.syncExchangeRate(tenantId, branchId);
  }

  @Get('warehouses')
  async getWarehouses(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-branch-id') branchId: string,
  ) {
    return this.dataService.getWarehouses(tenantId, branchId);
  }

  @Get('franchises')
  async getFranchises(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-branch-id') branchId: string,
  ) {
    return this.dataService.getFranchises(tenantId, branchId);
  }
}
