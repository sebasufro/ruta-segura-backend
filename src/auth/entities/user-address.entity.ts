import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_addresses')
export class UserAddress {
  @PrimaryGeneratedColumn('uuid')
  id_address: string;

  @Column({ type: 'uuid' })
  id_user: string;

  @Column({ length: 50 })
  alias: string;

  @Column({ length: 255 })
  full_address: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user' })
  user: User;
}