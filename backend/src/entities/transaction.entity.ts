import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TransactionType {
  SALE = 'SALE',
  PURCHASE = 'PURCHASE',
  QUOTE = 'QUOTE',
  ORDER = 'ORDER',
  RETURN = 'RETURN',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  docNumber: string;

  @Column({ nullable: true })
  controlNumber: string;

  @Column()
  customerOrSupplierName: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  tax: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 1 })
  rate: number;

  @Column({ default: 'Pagada' })
  status: string;

  @Column({
    type: 'varchar',
    default: TransactionType.SALE,
  })
  type: TransactionType;

  @Column('uuid')
  tenantId: string;

  @Column('uuid')
  branchId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
