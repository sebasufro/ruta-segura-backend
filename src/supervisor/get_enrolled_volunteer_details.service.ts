import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GetEnrolledVolunteerDetailsService {
  constructor(private prisma: PrismaService) {}

  async getEnrolledVolunteerDetails(
    idSupervisor: string,
    idRoute: string,
    idVolunteer: string,
  ) {
    const route = await this.prisma.route.findUnique({
      where: { id_route: idRoute },
      select: { id_supervisor: true },
    });

    if (!route) {
      throw new NotFoundException('Ruta no encontrada.');
    }

    if (route.id_supervisor !== idSupervisor) {
      throw new NotFoundException('El voluntario no existe o no está en esta ruta.');
    }

    const enrollment = await this.prisma.route_enrollment.findUnique({
      where: {
        id_route_id_volunteer: {
          id_route: idRoute,
          id_volunteer: idVolunteer,
        },
      },
      select: {
        confirmation_status: true,
        users: {
          select: {
            full_name: true,
            email: true,
            phone_number: true,
            emergency_contacts: {
              select: {
                contact_name: true,
              },
              take: 1,
            },
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('El voluntario no existe o no está en esta ruta.');
    }

    return {
      id: idVolunteer,
      full_name: enrollment.users.full_name,
      email: enrollment.users.email,
      phone_number: enrollment.users.phone_number,
      status: enrollment.confirmation_status || 'Activo',
      emergency_contact:
        enrollment.users.emergency_contacts[0]?.contact_name || null,
    };
  }
}
