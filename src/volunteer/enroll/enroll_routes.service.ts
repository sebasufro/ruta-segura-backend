import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EnrollmentRequestDto } from './dto/enrollment-request.dto';

@Injectable()
export class EnrollRoutesService {
    constructor(private prisma: PrismaService) {}
    
    async create(volunteerId: string, routeId: string, dto: EnrollmentRequestDto) {
        return this.prisma.route_enrollment.create({
            data: {
                id_route: routeId,
                id_volunteer: volunteerId,
                enrollment_date: new Date(dto.enrollment_date),
                activity_type: dto.activity_type,
                confirmation_status: dto.confirmation_status,
            },
            select: {
                id_route: true,
                id_volunteer: true,
                enrollment_date: true,
                activity_type: true,
                confirmation_status: true,
            },
        });
    }

    async findOne(volunteerId: string, routeId: string) {
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
            throw new NotFoundException('Contacto de emergencia no encontrado.');
        }
        if (enrollment.id_volunteer !== volunteerId) {
            throw new ForbiddenException('No tienes acceso a este contacto.');
        }

        return enrollment;
    }

    async remove(volunteerId: string, routeId: string) {
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