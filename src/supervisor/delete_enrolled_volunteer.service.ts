import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeleteEnrolledVolunteerService {
  constructor(private prisma: PrismaService) {}

  async deleteEnrolledVolunteer(idSupervisor: string, idVolunteer: string) {
    const supervisor = await this.prisma.users.findUnique({
      where: { id_user: idSupervisor },
      select: { id_user: true },
    });

    if (!supervisor) {
      throw new NotFoundException('Supervisor no encontrado.');
    }

    const routes = await this.prisma.route.findMany({
      where: { id_supervisor: idSupervisor },
      select: { id_route: true },
    });

    if (routes.length === 0) {
      throw new NotFoundException('No se encontraron rutas asociadas al supervisor.');
    }

    const enrollment = await this.prisma.route_enrollment.findFirst({
      where: {
        id_volunteer: idVolunteer,
        id_route: { in: routes.map((r) => r.id_route) },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('El voluntario no está inscrito en ninguna ruta de este supervisor.');
    }

    await this.prisma.route_enrollment.delete({
      where: {
        id_route_id_volunteer: {
          id_route: enrollment.id_route,
          id_volunteer: idVolunteer,
        },
      },
    });

    return { message: 'El voluntario ha sido retirado de la ruta con éxito' };
  }
}
