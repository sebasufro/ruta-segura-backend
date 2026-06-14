import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { EmergencyContact } from './emergency-contact.entity.js';
import { UserAddress } from './user-address.entity.js';
// import { Organization } from './organization.entity'; // Lo importaremos luego

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id_user: string;

  @Column({ length: 12, nullable: true })
  rut: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 100, nullable: true })
  full_name: string;

  @Column({ length: 20, nullable: true })
  phone_number: string;

  @Column({ length: 50 })
  role: string;

  @Column({ length: 20, nullable: true })
  account_status: string;

  @Column({ type: 'text', nullable: true })
  admin_observations: string;

  @Column({ type: 'int', default: 1 })
  token_version: number;

  @Column({ type: 'uuid', nullable: true })
  id_organization: string;

  // Relaciones
  @OneToMany(() => EmergencyContact, (contact) => contact.user, { cascade: true })
  emergency_contacts: EmergencyContact[];

  @OneToMany(() => UserAddress, (address) => address.user, { cascade: true })
  addresses: UserAddress[];
}