import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GetEmergencyNumberService {
  constructor(private prisma: PrismaService) {}

  async getEmergencyNumber(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id_user: id },
      select: { id_user: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const contact = await this.prisma.emergency_contacts.findFirst({
      where: { id_user: id },
      select: {
        contact_name: true,
        contact_number: true,
      },
    });

    if (!contact) {
      throw new NotFoundException('Contacto de emergencia no encontrado.');
    }

    return {
      status: 'success',
      data: {
        nombre_contacto: contact.contact_name,
        phone_number: contact.contact_number,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
