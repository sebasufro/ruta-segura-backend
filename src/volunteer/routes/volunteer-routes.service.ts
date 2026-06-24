import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Route } from './entities/route.entity';

@Injectable()
export class VolunteerRoutesService {
 constructor(
  private readonly dataSource: DataSource,
) {
  this.routeRepository = dataSource.getRepository(Route);
  this.enrollmentRepository = dataSource.getRepository(RouteEnrollment);
  this.userRepository = dataSource.getRepository(User);
}

private readonly routeRepository: Repository<Route>;
private readonly enrollmentRepository: Repository<RouteEnrollment>;
private readonly userRepository: Repository<User>;

  async findRouteById(id_route: string) {
    try {
      // Consulta relacional ajustada al tipado estricto de FindOptionsRelations
      const route = await this.routeRepository.findOne({
        where: { id_route: id_route },
        relations: {
          supervisor: true, // <-- CAMBIA EL ARREGLO POR ESTE OBJETO LITERAL
        },
      });

      if (!route) {
        throw new NotFoundException({
          error: 'Ruta no encontrada',
          message: 'La ruta solicitada no existe o ha sido dada de baja.'
        });
      }

      return {
        id: route.id_route,
        route_name: route.route_name,
        description: route.description || 'Sin descripción disponible',
        sector: 'Temuco', 
        schedule: `${route.starting_datetime?.toISOString() || ''} - ${route.ending_datetime?.toISOString() || ''}`,
        active_volunteers: route.max_capacity || 0,
        status: route.status || 'active'
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        error: 'Error interno',
        message: 'Error al intentar recuperar la información técnica de la ruta.'
      });
    }
  }
}