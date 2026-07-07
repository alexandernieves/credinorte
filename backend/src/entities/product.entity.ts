import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  brand: string;

  @Column()
  department: string;

  @Column()
  group: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  stock: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  minStock: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  price: number;

  @Column()
  warehouse: string;

  @Column()
  version: string;

  @Column()
  priceType: string;

  @Column('uuid')
  tenantId: string;

  @Column('uuid')
  branchId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
