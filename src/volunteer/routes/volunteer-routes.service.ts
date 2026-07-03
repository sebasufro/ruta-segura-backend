import { Injectable, NotFoundException } from '@nestjs/common';
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
        street_geometry: r.street_geometry,
        base_points: r.base_points,
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

  async getMyEnrollments(volunteerId: string) {
    const enrollments = await this.prisma.route_enrollment.findMany({
      where: { id_volunteer: volunteerId },
      include: {
        route: {
          select: {
            id_route: true,
            route_name: true,
            description: true,
            status: true,
            starting_datetime: true,
            ending_datetime: true,
            transport_type: true,
            distance_meters: true,
            street_geometry: true,
            base_points: true,
            users: {
              select: {
                full_name: true,
                organization: { select: { name: true } },
              },
            },
          },
        },
      },
      orderBy: { enrollment_date: 'desc' },
    });

    return {
      status: 'success',
      total_results: enrollments.length,
      enrollments: enrollments.map((e) => ({
        id_route: e.id_route,
        enrollment_date: e.enrollment_date,
        confirmation_status: e.confirmation_status,
        activity_type: e.activity_type,
        route: {
          route_name: e.route.route_name,
          description: e.route.description,
          status: e.route.status,
          starting_datetime: e.route.starting_datetime,
          ending_datetime: e.route.ending_datetime,
          transport_type: e.route.transport_type,
          distance_meters: e.route.distance_meters,
          street_geometry: e.route.street_geometry,
          base_points: e.route.base_points,
          supervisor: e.route.users
            ? {
                full_name: e.route.users.full_name,
                organization: e.route.users.organization?.name ?? null,
              }
            : null,
        },
      })),
    };
  }
}
