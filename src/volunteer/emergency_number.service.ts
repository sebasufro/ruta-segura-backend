import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmergencyContactDto } from './dto/create-contact.dto';
import { UpdateEmergencyContactDto } from './dto/update-contact.dto';

@Injectable()
export class EmergencyNumberService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateEmergencyContactDto) {
    return this.prisma.emergency_contacts.create({
      data: {
        id_user: userId,
        contact_name: dto.contact_name,
        contact_number: dto.contact_number,
      },
      select: {
        id_contact: true,
        contact_name: true,
        contact_number: true,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.emergency_contacts.findMany({
      where: { id_user: userId },
      select: {
        id_contact: true,
        contact_name: true,
        contact_number: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const contact = await this.prisma.emergency_contacts.findUnique({
      where: { id_contact: id },
    });

    if (!contact) {
      throw new NotFoundException('Contacto de emergencia no encontrado.');
    }
    if (contact.id_user !== userId) {
      throw new ForbiddenException('No tienes acceso a este contacto.');
    }

    return contact;
  }

  async update(id: string, userId: string, dto: UpdateEmergencyContactDto) {
    await this.findOne(id, userId);

    return this.prisma.emergency_contacts.update({
      where: { id_contact: id },
      data: dto,
      select: {
        id_contact: true,
        contact_name: true,
        contact_number: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.emergency_contacts.delete({
      where: { id_contact: id },
    });
  }
}
