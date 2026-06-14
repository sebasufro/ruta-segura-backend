import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('emergency_contacts')
export class EmergencyContact {
  @PrimaryGeneratedColumn('uuid')
  id_contact: string;

  @Column({ type: 'uuid' })
  id_user: string;

  @Column({ length: 100 })
  contact_name: string;

  @Column({ length: 20 })
  contact_number: string;

  @ManyToOne(() => User, (user) => user.emergency_contacts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user' })
  user: User;
}