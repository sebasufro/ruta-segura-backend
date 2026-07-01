import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrolledVolunteersService {
    constructor(private prisma: PrismaService) {}
  
    findAll(routeId: string) {
        return this.prisma.route_enrollment.findMany({
            where: { id_route: routeId },
            select: {
                id_volunteer: true,
                enrollment_date: true,
                users: {
                    select: {
                        full_name: true,
                    }
                }
            },
        });
    }

    async findOne(routeId: string, volunteerId: string) {
        const enrollment = await this.prisma.route_enrollment.findUnique({
            where: { 
                id_route_id_volunteer :{
                    id_route: routeId,
                    id_volunteer: volunteerId,
                }
            },
            select: {
                id_volunteer: true,
                enrollment_date: true,
                users: {
                    select: {
                        full_name: true,
                        rut: true,
                        phone_number: true,
                        email: true,
                        emergency_contacts: {
                            select: {
                                contact_name: true,
                                contact_number: true,
                            },
                            take: 1
                        },
                        user_addresses: {
                            select: {
                                alias: true,
                                full_address: true,
                            }
                        }
                    }
                }
            },
        });
        if (!enrollment) {
            throw new NotFoundException('Voluntario no encontrado');
        }
        if (enrollment.id_volunteer !== volunteerId) {
            throw new ForbiddenException('No tienes permisos para revisar esta lista');
        }

        return enrollment;
    }

    async remove(routeId: string, volunteerId: string) {
        return this.prisma.route_enrollment.delete({
            where: { 
                id_route_id_volunteer :{
                    id_route: routeId,
                    id_volunteer: volunteerId,
                }
            },
        });
    }
}
