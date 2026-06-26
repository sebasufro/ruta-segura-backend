import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SendLocationDto } from './dto/send-location.dto';
import { ToggleSosDto } from './dto/toggle-sos.dto';

@Injectable()
export class LocationService {
  constructor(private readonly prisma: PrismaService) {}

  async sendLocation(volunteerId: string, dto: SendLocationDto) {
    await this.validateEnrollment(volunteerId, dto.id_route);

    const update = await this.prisma.location_updates.create({
      data: {
        id_user: volunteerId,
        id_route: dto.id_route,
        latitude: dto.latitude,
        longitude: dto.longitude,
        sos_active: 0,
      },
    });

    return {
      status: 'success',
      message: 'Ubicación registrada correctamente.',
      data: {
        id_location: update.id_location,
        timestamp: update.timestamp,
      },
    };
  }

  async toggleSos(volunteerId: string, dto: ToggleSosDto) {
    await this.validateEnrollment(volunteerId, dto.id_route);

    const update = await this.prisma.location_updates.create({
      data: {
        id_user: volunteerId,
        id_route: dto.id_route,
        // Reutiliza la última ubicación conocida si existe, o 0,0 como fallback
        latitude: await this.getLastLatitude(volunteerId, dto.id_route),
        longitude: await this.getLastLongitude(volunteerId, dto.id_route),
        sos_active: dto.sos_active ? 1 : 0,
      },
    });

    return {
      status: 'success',
      message: dto.sos_active ? 'Alerta SOS activada.' : 'Alerta SOS desactivada.',
      data: {
        id_location: update.id_location,
        sos_active: dto.sos_active,
        timestamp: update.timestamp,
      },
    };
  }

  private async validateEnrollment(volunteerId: string, routeId: string) {
    const route = await this.prisma.route.findUnique({
      where: { id_route: routeId },
    });

    if (!route) {
      throw new NotFoundException({ status: 'error', message: 'Ruta no encontrada.' });
    }

    const enrollment = await this.prisma.route_enrollment.findUnique({
      where: {
        id_route_id_volunteer: { id_route: routeId, id_volunteer: volunteerId },
      },
    });

    if (!enrollment) {
      throw new ForbiddenException({
        status: 'error',
        message: 'No estás inscrito en esta ruta.',
      });
    }
  }

  private async getLastLatitude(volunteerId: string, routeId: string): Promise<number> {
    const last = await this.prisma.location_updates.findFirst({
      where: { id_user: volunteerId, id_route: routeId },
      orderBy: { timestamp: 'desc' },
      select: { latitude: true },
    });
    return last ? Number(last.latitude) : 0;
  }

  private async getLastLongitude(volunteerId: string, routeId: string): Promise<number> {
    const last = await this.prisma.location_updates.findFirst({
      where: { id_user: volunteerId, id_route: routeId },
      orderBy: { timestamp: 'desc' },
      select: { longitude: true },
    });
    return last ? Number(last.longitude) : 0;
  }
}
