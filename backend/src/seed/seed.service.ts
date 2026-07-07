import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Tenant } from '../entities/tenant.entity';
import { Branch } from '../entities/branch.entity';
import { User, UserRole } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Warehouse } from '../entities/warehouse.entity';
import { Transaction, TransactionType } from '../entities/transaction.entity';
import { ExchangeRate } from '../entities/exchange-rate.entity';
import { Franchise } from '../entities/franchise.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    @InjectRepository(ExchangeRate)
    private readonly exchangeRateRepo: Repository<ExchangeRate>,
    @InjectRepository(Franchise)
    private readonly franchiseRepo: Repository<Franchise>,
  ) {}

  async onApplicationBootstrap() {
    await this.seed();
  }

  async seed() {
    const userCount = await this.userRepo.count();
    if (userCount > 0) {
      console.log('Database already seeded. Skipping...');
      return;
    }

    console.log('Seeding initial database data...');

    // 1. Create Tenant
    const tenant = this.tenantRepo.create({
      name: 'CreditNorte',
      rif: 'J-31245678-9',
      logoUrl: '/credinorte.png',
    });
    await this.tenantRepo.save(tenant);

    // 2. Create Branches
    const branch1 = this.branchRepo.create({
      name: 'Sucursal Andes',
      address: 'San Cristóbal, Estado Táchira',
      tenantId: tenant.id,
    });
    const branch2 = this.branchRepo.create({
      name: 'Sucursal Llanos',
      address: 'Acarigua, Estado Portuguesa',
      tenantId: tenant.id,
    });
    await this.branchRepo.save([branch1, branch2]);

    // 3. Create Users
    const passwordHash = await bcrypt.hash('password123', 10);
    const adminUser = this.userRepo.create({
      name: 'Alexander Nieves',
      email: 'admin@creditnorte.com',
      passwordHash,
      role: UserRole.ADMIN,
      tenantId: tenant.id,
      activeBranchId: branch1.id,
    });
    const sellerUser = this.userRepo.create({
      name: 'Juan Vendedor',
      email: 'seller@creditnorte.com',
      passwordHash,
      role: UserRole.SELLER,
      tenantId: tenant.id,
      activeBranchId: branch1.id,
    });
    const accountantUser = this.userRepo.create({
      name: 'María Contadora',
      email: 'accountant@creditnorte.com',
      passwordHash,
      role: UserRole.ACCOUNTANT,
      tenantId: tenant.id,
      activeBranchId: branch1.id,
    });
    await this.userRepo.save([adminUser, sellerUser, accountantUser]);

    // 4. Create Exchange Rates
    const rate1 = this.exchangeRateRepo.create({
      name: 'USD/Bs. BCV',
      rate: 36.4000,
      symbol: 'Bs.',
      tenantId: tenant.id,
      branchId: branch1.id,
    });
    const rate2 = this.exchangeRateRepo.create({
      name: 'USD/Bs. BCV',
      rate: 36.4500,
      symbol: 'Bs.',
      tenantId: tenant.id,
      branchId: branch2.id,
    });
    await this.exchangeRateRepo.save([rate1, rate2]);

    // 5. Create Warehouses
    const wh1 = this.warehouseRepo.create({
      code: '01',
      name: 'ALMACEN PRINCIPAL',
      zona: 'ANDES',
      tenantId: tenant.id,
      branchId: branch1.id,
    });
    const wh2 = this.warehouseRepo.create({
      code: '02',
      name: 'ALMACEN SECUNDARIO',
      zona: 'ANDES',
      tenantId: tenant.id,
      branchId: branch1.id,
    });
    const wh3 = this.warehouseRepo.create({
      code: '03',
      name: 'ALMACEN PORTUGUESA',
      zona: 'LLANOS',
      tenantId: tenant.id,
      branchId: branch2.id,
    });
    await this.warehouseRepo.save([wh1, wh2, wh3]);

    // 6. Create Products
    const prod1 = this.productRepo.create({
      code: '0000000001',
      name: 'AIRE ACOND DE VENTANA 8.000 BTU TCL',
      category: 'LÍNEA BLANCA',
      brand: 'TCL',
      department: 'HOGAR',
      group: 'ELECTRODOMÉSTICOS',
      stock: 12.00,
      minStock: 2.00,
      price: 280.00,
      warehouse: '01',
      version: 'A',
      priceType: 'Público',
      tenantId: tenant.id,
      branchId: branch1.id,
    });
    const prod2 = this.productRepo.create({
      code: '0000000002',
      name: 'CELULAR XIAOMI REDMI 15C 256GB',
      category: 'TECNOLOGÍA',
      brand: 'XIAOMI',
      department: 'TELEFONÍA',
      group: 'MÓVILES',
      stock: 35.00,
      minStock: 5.00,
      price: 230.00,
      warehouse: '01',
      version: 'A',
      priceType: 'Público',
      tenantId: tenant.id,
      branchId: branch1.id,
    });
    const prod3 = this.productRepo.create({
      code: '0000000003',
      name: 'MOTO HAOJIN CONDOR 150CC',
      category: 'VEHÍCULOS',
      brand: 'HAOJIN',
      department: 'MOTOCICLETAS',
      group: 'MOTOS',
      stock: 3.00,
      minStock: 1.00,
      price: 1100.00,
      warehouse: '02',
      version: 'A',
      priceType: 'Distribuidor',
      tenantId: tenant.id,
      branchId: branch1.id,
    });
    await this.productRepo.save([prod1, prod2, prod3]);

    // 7. Create Franchises
    const fran1 = this.franchiseRepo.create({
      code: '0000000001',
      name: 'BARRIO OBRERO',
      tenantId: tenant.id,
      branchId: branch1.id,
    });
    const fran2 = this.franchiseRepo.create({
      code: '0000000002',
      name: 'LA FRIA',
      tenantId: tenant.id,
      branchId: branch1.id,
    });
    await this.franchiseRepo.save([fran1, fran2]);

    // 8. Create Transactions
    const tx1 = this.transactionRepo.create({
      docNumber: '0000000012',
      controlNumber: '00-001235',
      customerOrSupplierName: 'INVERSIONES SAN CRISTOBAL C.A.',
      date: '2026-06-23',
      subtotal: 510.00,
      tax: 81.60,
      total: 591.60,
      rate: 36.4000,
      status: 'Pagada',
      type: TransactionType.SALE,
      tenantId: tenant.id,
      branchId: branch1.id,
    });
    const tx2 = this.transactionRepo.create({
      docNumber: '0000000013',
      controlNumber: '00-001236',
      customerOrSupplierName: 'MARCOS ANTONIO PINTO',
      date: '2026-06-24',
      subtotal: 280.00,
      tax: 44.80,
      total: 324.80,
      rate: 36.4000,
      status: 'Pendiente',
      type: TransactionType.SALE,
      tenantId: tenant.id,
      branchId: branch1.id,
    });
    const tx3 = this.transactionRepo.create({
      docNumber: '003646',
      controlNumber: '00-009646',
      customerOrSupplierName: 'DANIEL ALFONSO ROJAS CELIS',
      date: '2026-05-22',
      subtotal: 1200.00,
      tax: 192.00,
      total: 1392.00,
      rate: 36.4000,
      status: 'Pagada',
      type: TransactionType.PURCHASE,
      tenantId: tenant.id,
      branchId: branch1.id,
    });
    await this.transactionRepo.save([tx1, tx2, tx3]);

    console.log('Database seeding completed successfully!');
  }
}
