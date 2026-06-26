import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface DeleteEnrollmentResponseDTO {
  message: string;
}

@Injectable()
export class DeleteEnrolledRoutesService {
  constructor(private prisma: PrismaService) {}

  async deleteEnrollment(
    idVolunteer: string,
    idRoute: string,
  ): Promise<DeleteEnrollmentResponseDTO> {
    try {
      // Check if enrollment exists
      const enrollment = await this.prisma.route_enrollment.findUnique({
        where: {
          id_route_id_volunteer: {
            id_route: idRoute,
            id_volunteer: idVolunteer,
          },
        },
      });

      if (!enrollment) {
        throw new NotFoundException('La ruta inscrita no existe');
      }

      // Delete the enrollment record
      await this.prisma.route_enrollment.delete({
        where: {
          id_route_id_volunteer: {
            id_route: idRoute,
            id_volunteer: idVolunteer,
          },
        },
      });

      return {
        message: 'Inscripción eliminada correctamente',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error deleting enrollment: ${error.message}`);
    }
  }
}
