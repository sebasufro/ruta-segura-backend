import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ListEnrolledVolunteersService {
  constructor(private prisma: PrismaService) {}

  async getEnrolledVolunteers(idSupervisor: string, idRoute: string) {
    const route = await this.prisma.route.findUnique({
      where: { id_route: idRoute },
      select: { id_supervisor: true },
    });

    if (!route) {
      throw new NotFoundException('Ruta no encontrada.');
    }

    if (route.id_supervisor !== idSupervisor) {
      throw new UnauthorizedException('El supervisor no es el supervisor de esta ruta.');
    }

    const enrollments = await this.prisma.route_enrollment.findMany({
      where: { id_route: idRoute },
      select: {
        id_volunteer: true,
        users: {
          select: {
            full_name: true,
            rut: true,
            phone_number: true,
          },
        },
      },
    });

    return enrollments.map((enrollment) => ({
      id_volunteer: enrollment.id_volunteer,
      name: enrollment.users.full_name,
      rut: enrollment.users.rut,
      phone_number: enrollment.users.phone_number,
    }));
  }
}
