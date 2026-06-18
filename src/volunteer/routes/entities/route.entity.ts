import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity.js';

@Entity('route')
export class Route {
  @PrimaryGeneratedColumn('uuid')
  id_route!: string;

  @Column({ type: 'uuid', nullable: true })
  id_supervisor!: string | null;

  @Column({ type: 'varchar', length: 100 })
  route_name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  starting_datetime!: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  ending_datetime!: Date | null;

  @Column({ type: 'int', nullable: true })
  max_capacity!: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  starting_latitude!: number | null;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  starting_longitude!: number | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  status!: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_supervisor' })
  supervisor!: User;
}