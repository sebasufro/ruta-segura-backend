import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}
  async create(userId: string, dto: CreateAddressDto) {
    return this.prisma.user_addresses.create({
      data: {
        id_user: userId,
        alias: dto.alias,
        full_address: dto.full_address,
      },
      select: {
        id_address: true,
        alias: true,
        full_address: true,
      },
    });
  }
  
  findAll(userId: string) {
    return this.prisma.user_addresses.findMany({
      where: { id_user: userId },
      select: {
        id_address: true,
        alias: true,
        full_address: true,
      },
    });
  }
  
  async findOne(id: string, userId: string) {
    const address = await this.prisma.user_addresses.findUnique({
      where: { id_address: id },
    });
    if (!address) {
      throw new NotFoundException('Dirección no encontrada.');
    }
    if (address.id_user !== userId) {
      throw new ForbiddenException('No tienes acceso a esta dirección.');
    }
    return address;
  }
  
  async update(id: string, userId: string, dto: UpdateAddressDto) {
    await this.findOne(id, userId);
    return this.prisma.user_addresses.update({
      where: { id_address: id },
      data: dto,
      select: {
        id_address: true,
        alias: true,
        full_address: true,
      },
    });
  }
  
  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
  
    return this.prisma.user_addresses.delete({
      where: { id_address: id },
    });
  }
}