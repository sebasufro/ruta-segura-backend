import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../../auth/entities/user.entity.js';
import { Route } from '../../routes/entities/route.entity.js';

@Entity('route_enrollment')
export class RouteEnrollment {
  @PrimaryGeneratedColumn('uuid')
  id_enrollment!: string;

  @Column({ type: 'uuid' })
  id_volunteer!: string;

  @Column({ type: 'uuid' })
  id_route!: string;

  @CreateDateColumn()
  enrolled_at!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_volunteer' })
  volunteer!: User;

  @ManyToOne(() => Route)
  @JoinColumn({ name: 'id_route' })
  route!: Route;
}