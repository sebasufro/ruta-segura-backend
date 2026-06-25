import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { FilterRouteDto } from './dto/filter-route.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RouteService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateRouteDto) {
    const { id_supervisor, starting_datetime, ending_datetime, ...rest } = dto;

    const data: Prisma.routeCreateInput = {
      ...rest,
      starting_datetime: starting_datetime ? new Date(starting_datetime) : undefined,
      ending_datetime: ending_datetime ? new Date(ending_datetime) : undefined,
      users: id_supervisor
        ? { connect: { id_user: id_supervisor } }
        : undefined,
    };

    return this.prisma.route.create({ data });
  }

  findAll(filters: FilterRouteDto) {
    const where: Prisma.routeWhereInput = {
      status: filters.status,
      transport_type: filters.transport_type,
      id_supervisor: filters.id_supervisor,
      route_name: filters.route_name
        ? { contains: filters.route_name, mode: 'insensitive' }
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

  async findOne(id: string) {
    const route = await this.prisma.route.findUnique({
      where: { id_route: id },
    });

    if (!route) {
      throw new NotFoundException(`Ruta con id ${id} no encontrada`);
    }

    return route;
  }

  async update(id: string, dto: UpdateRouteDto) {
    await this.findOne(id); // valida existencia

    const { id_supervisor, starting_datetime, ending_datetime, ...rest } = dto;

    const data: Prisma.routeUpdateInput = {
      ...rest,
      starting_datetime: starting_datetime ? new Date(starting_datetime) : undefined,
      ending_datetime: ending_datetime ? new Date(ending_datetime) : undefined,
      users: id_supervisor
        ? { connect: { id_user: id_supervisor } }
        : undefined,
    };

    return this.prisma.route.update({
      where: { id_route: id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // valida existencia

    return this.prisma.route.delete({
      where: { id_route: id },
    });
  }
}