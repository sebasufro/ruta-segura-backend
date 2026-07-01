import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EnrollmentRequestDTO } from './dto/enrollment_request.dto';

export interface EnrollmentResponseDTO {
  message: string;
}

@Injectable()
export class EnrollNewRoutesService {
  constructor(private prisma: PrismaService) {}

  async enrollVolunteerInRoute(
    idVolunteer: string,
    idRoute: string,
    enrollmentData: EnrollmentRequestDTO,
  ): Promise<EnrollmentResponseDTO> {
    try {
      // Check if route exists and get its details
      const route = await this.prisma.route.findUnique({
        where: { id_route: idRoute },
        include: {
          route_enrollment: {
            select: { id_volunteer: true },
          },
        },
      });

      if (!route) {
        throw new NotFoundException('Ruta no encontrada.');
      }

      // Check if route is active or available
      if (route.status !== 'PUBLISHED' && route.status !== 'ACTIVE') {
        throw new BadRequestException('La ruta no está disponible para inscripción.');
      }

      // Check if volunteer is already enrolled in this route
      const existingEnrollment = await this.prisma.route_enrollment.findUnique({
        where: {
          id_route_id_volunteer: {
            id_route: idRoute,
            id_volunteer: idVolunteer,
          },
        },
      });

      if (existingEnrollment) {
        throw new ConflictException('Ya te encuentras inscrito en esta ruta.');
      }

      // Check if route is at max capacity
      if (route.max_capacity && route.route_enrollment.length >= route.max_capacity) {
        throw new BadRequestException('La ruta ha alcanzado su capacidad máxima.');
      }

      // Parse enrollment date - handle Spanish date format
      let enrollmentDate = new Date();
      if (enrollmentData.enrollment_date) {
        const parsedDate = new Date(enrollmentData.enrollment_date);
        if (!isNaN(parsedDate.getTime())) {
          enrollmentDate = parsedDate;
        }
      }

      // Create enrollment record
      await this.prisma.route_enrollment.create({
        data: {
          id_route: idRoute,
          id_volunteer: idVolunteer,
          enrollment_date: enrollmentDate,
          activity_type: enrollmentData.activity_type || 'Ruta Social',
          confirmation_status: enrollmentData.confirmation_status || 'PENDING',
        },
      });

      return {
        message: `Inscrito correctamente en la ruta ${idRoute}.`,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new Error(`Error enrolling volunteer in route: ${error.message}`);
    }
  }
}
