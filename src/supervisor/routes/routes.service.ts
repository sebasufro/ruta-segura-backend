import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { FilterRouteDto } from './dto/filter-route.dto';
import type { Prisma } from '../../generated/client';

@Injectable()
export class RouteService {
  constructor(private prisma: PrismaService) {}

  create(supervisorId: string, dto: CreateRouteDto) {
    const { starting_datetime, ending_datetime, ...rest } = dto;

    const data = {
      ...rest,
      starting_datetime: starting_datetime ? new Date(starting_datetime) : undefined,
      ending_datetime: ending_datetime ? new Date(ending_datetime) : undefined,
      users: { connect: { id_user: supervisorId } },
    };

    return this.prisma.route.create({ data });
  }

  findAll(supervisorId: string, filters: FilterRouteDto) {
    const where: Prisma.routeWhereInput = {
      id_supervisor: supervisorId,
      status: filters.status,
      transport_type: filters.transport_type,
      route_name: filters.route_name
        ? { contains: filters.route_name, mode: 'insensitive' as const }
        : undefined,
      starting_datetime:
        filters.starting_date_from || filters.starting_date_to
          ? {
              gte: filters.starting_date_from ? new Date(filters.starting_date_from) : undefined,
              lte: filters.starting_date_to ? new Date(filters.starting_date_to) : undefined,
            }
          : undefined,
    };

    return this.prisma.route.findMany({ where });
  }

  async findOne(id: string, supervisorId: string) {
    const route = await this.prisma.route.findUnique({ where: { id_route: id } });

    if (!route) throw new NotFoundException(`Ruta con id ${id} no encontrada`);
    if (route.id_supervisor !== supervisorId) throw new ForbiddenException('No tienes acceso a esta ruta');

    return route;
  }

  async update(id: string, supervisorId: string, dto: UpdateRouteDto) {
    await this.findOne(id, supervisorId);

    const { starting_datetime, ending_datetime, ...rest } = dto;

    const data = {
      ...rest,
      starting_datetime: starting_datetime ? new Date(starting_datetime) : undefined,
      ending_datetime: ending_datetime ? new Date(ending_datetime) : undefined,
    };

    return this.prisma.route.update({ where: { id_route: id }, data });
  }

  async remove(id: string, supervisorId: string) {
    await this.findOne(id, supervisorId);
    return this.prisma.route.delete({ where: { id_route: id } });
  }
}
