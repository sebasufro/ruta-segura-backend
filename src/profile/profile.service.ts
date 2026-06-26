import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id_user: userId },
      include: {
        organization: { select: { name: true } },
        user_addresses: { select: { alias: true, full_address: true } },
        emergency_contacts: { select: { contact_name: true, contact_number: true } },
      },
    });

    if (!user) throw new NotFoundException({ status: 'error', message: 'Usuario no encontrado.' });

    return {
      status: 'success',
      data: {
        id_user: user.id_user,
        full_name: user.full_name,
        email: user.email,
        rut: user.rut,
        role: user.role,
        phone_number: user.phone_number,
        account_status: user.account_status,
        organization: user.organization?.name ?? null,
        addresses: user.user_addresses,
        emergency_contacts: user.emergency_contacts,
      },
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.users.findUnique({ where: { id_user: userId } });
    if (!user) throw new NotFoundException({ status: 'error', message: 'Usuario no encontrado.' });

    await this.prisma.$transaction(async (tx) => {
      const dataToUpdate: Record<string, string> = {};

      if (dto.full_name?.trim()) {
        dataToUpdate.full_name = dto.full_name.trim();
      }

      if (dto.phone_number?.trim()) {
        dataToUpdate.phone_number = dto.phone_number.trim();
      }

      if (dto.new_password) {
        dataToUpdate.password = await bcrypt.hash(dto.new_password, 10);
      }

      if (Object.keys(dataToUpdate).length > 0) {
        await tx.users.update({ where: { id_user: userId }, data: dataToUpdate });
      }

      if (dto.emergency_contact) {
        const existing = await tx.emergency_contacts.findFirst({ where: { id_user: userId } });
        const contactData = {
          contact_name: dto.emergency_contact.contact_name,
          contact_number: dto.emergency_contact.contact_number,
        };

        if (existing) {
          await tx.emergency_contacts.update({
            where: { id_contact: existing.id_contact },
            data: contactData,
          });
        } else {
          await tx.emergency_contacts.create({ data: { id_user: userId, ...contactData } });
        }
      }
    });

    return {
      status: 'success',
      message: 'Perfil actualizado correctamente.',
    };
  }
}
