import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VolunteerRoutesService {
  constructor(private prisma: PrismaService) {}

  async getAvailableRoutes(volunteerId: string) {
    const routes = await this.prisma.route.findMany({
      where: {
        status: 'PUBLISHED',
        starting_datetime: { gte: new Date() },
        NOT: {
          route_enrollment: {
            some: { id_volunteer: volunteerId },
          },
        },
      },
      include: {
        users: {
          select: {
            full_name: true,
            organization: { select: { name: true } },
          },
        },
        _count: { select: { route_enrollment: true } },
      },
      orderBy: { starting_datetime: 'asc' },
    });

    const available = routes.filter(
      (r) => r.max_capacity === null || r._count.route_enrollment < r.max_capacity,
    );

    return {
      status: 'success',
      total_results: available.length,
      routes: available.map((r) => ({
        id_route: r.id_route,
        route_name: r.route_name,
        description: r.description,
        starting_datetime: r.starting_datetime,
        ending_datetime: r.ending_datetime,
        transport_type: r.transport_type,
        distance_meters: r.distance_meters,
        min_volunteers: r.min_volunteers,
        spots_remaining:
          r.max_capacity !== null ? r.max_capacity - r._count.route_enrollment : null,
        supervisor: r.users
          ? {
              full_name: r.users.full_name,
              organization: r.users.organization?.name ?? null,
            }
          : null,
      })),
    };
  }
}
