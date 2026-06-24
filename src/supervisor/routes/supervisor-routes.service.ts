import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Route } from '../../volunteer/routes/entities/route.entity.js';
import { User } from '../../auth/entities/user.entity.js';

@Injectable()
export class SupervisorRoutesService {
constructor(
  private readonly dataSource: DataSource,
) {
  this.routeRepository = dataSource.getRepository(Route);
  this.userRepository = dataSource.getRepository(User);
}

private readonly routeRepository: Repository<Route>;
private readonly userRepository: Repository<User>;

  async findCreatedRoutes(id_supervisor: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id_user: id_supervisor } });
      if (!user) {
        throw new NotFoundException({ error: 'usuario no encontrado' });
      }

      const routes = await this.routeRepository.find({ where: { id_supervisor } });

      return routes.map((route) => ({
        id: route.id_route,
        route_name: route.route_name,
        sector: 'Temuco',
        status: route.status ?? 'active',
        created_at: route.starting_datetime
          ? route.starting_datetime.toISOString().slice(0, 10)
          : null,
      }));
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException({ error: 'Error interno del servidor' });
    }
  }

  async createRoute(id_supervisor: string, data: any) {
    const newRoute = this.routeRepository.create({ ...data, id_supervisor });
    return await this.routeRepository.save(newRoute);
  }

  async updateRoute(id_route: string, data: any) {
    const route = await this.routeRepository.findOneBy({ id_route });
    if (!route) throw new NotFoundException({ error: 'Ruta no encontrada' });
    Object.assign(route, data);
    return await this.routeRepository.save(route);
  }

  async deleteRoute(id_route: string) {
    const result = await this.routeRepository.delete(id_route);
    if (result.affected === 0) throw new NotFoundException({ error: 'La ruta especificada no fue encontrada.' });
    return { message: 'Ruta eliminada correctamente', id_route };
  }
}