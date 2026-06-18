import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from '../../volunteer/routes/entities/route.entity.js';

@Injectable()
export class SupervisorRoutesService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
  ) {}

  async createRoute(id_supervisor: string, data: any) {
    const newRoute = this.routeRepository.create({ ...data, id_supervisor });
    return await this.routeRepository.save(newRoute);
  }

  async updateRoute(id_route: string, data: any) {
    const route = await this.routeRepository.findOneBy({ id_route });
    if (!route) throw new NotFoundException('Ruta no encontrada');
    
    Object.assign(route, data);
    return await this.routeRepository.save(route);
  }

  async deleteRoute(id_route: string) {
    const result = await this.routeRepository.delete(id_route);
    if (result.affected === 0) throw new NotFoundException('Ruta no encontrada');
    return { message: 'Ruta eliminada correctamente', id_route };
  }
}