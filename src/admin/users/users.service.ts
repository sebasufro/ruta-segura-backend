import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { timingSafeEqual } from 'crypto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { DashboardQueryDto } from './dto/date-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const ALLOWED_ROLES = new Set(['ADMIN', 'SUPERVISOR', 'VOLUNTEER']);

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(idAdmin: string, createUserDto: CreateUserDto, certificadoFile?: any) {
    await this.validateAdmin(idAdmin, 'Acceso restringido a administradores.');
    this.validateCreateUserDto(createUserDto, certificadoFile);

    try {
      const password = await this.hashPassword(createUserDto.password);
      const shouldCreateDocument = this.shouldRequireCertificate(createUserDto.rol);
      const certificado = shouldCreateDocument
        ? this.getCertificateData(createUserDto, certificadoFile)
        : null;

      const result = await this.prisma.$transaction(async (tx) => {
        const organization =
          (await tx.organization.findFirst({
            where: { name: createUserDto.organizacion.trim() },
          })) ??
          (await tx.organization.create({
            data: { name: createUserDto.organizacion.trim() },
          }));

        const user = await tx.users.create({
          data: {
            email: createUserDto.correo_electronico.trim().toLowerCase(),
            password,
            rut: this.normalizeRut(createUserDto.rut),
            role: createUserDto.rol.trim().toUpperCase(),
            full_name: createUserDto.nombre_completo.trim(),
            phone_number: createUserDto.telefono?.trim(),
            account_status: 'ACTIVE',
            id_organization: organization.id_organization,
          },
        });

        const document = certificado
          ? await tx.organization_documents.create({
              data: {
                id_organization: organization.id_organization,
                file_name: certificado.nombre,
                content_base64: certificado.contenido,
                document_status: 'PENDING',
              },
            })
          : null;

        return { user, document };
      });

      return {
        status: 'success',
        message: 'Usuario creado exitosamente',
        id_usuario: result.user.id_user,
        id_document: result.document?.id_document ?? null,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        status: 'error',
        message: 'Error interno al registrar el usuario.',
      });
    }
  }

  async updateUser(idAdmin: string, idTarget: string, updateUserDto: UpdateUserDto) {
    await this.validateAdmin(
      idAdmin,
      'No autorizado. Se requiere nivel de acceso administrativo.',
    );

    const user = await this.prisma.users.findUnique({ where: { id_user: idTarget } });
    if (!user) {
      throw new NotFoundException({
        status: 'error',
        message: 'El usuario especificado no fue encontrado.',
      });
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        const dataToUpdate: Record<string, string> = {};

        const newName = updateUserDto.new_name;
        const roleValue = updateUserDto.role;
        const phoneNumber = updateUserDto.phone_number;
        const organizationName = updateUserDto.organizacion;

        if (this.hasText(newName)) {
          dataToUpdate.full_name = newName.trim();
        }

        if (this.hasText(roleValue)) {
          const role = roleValue.trim().toUpperCase();
          if (!ALLOWED_ROLES.has(role)) {
            throw new BadRequestException({
              status: 'error',
              message: 'El rol ingresado no es válido.',
            });
          }
          dataToUpdate.role = role;
        }

        if (this.hasText(phoneNumber)) {
          dataToUpdate.phone_number = phoneNumber.trim();
        }

        if (this.hasText(organizationName)) {
          const organization =
            (await tx.organization.findFirst({
              where: { name: organizationName.trim() },
            })) ??
            (await tx.organization.create({
              data: { name: organizationName.trim() },
            }));

          dataToUpdate.id_organization = organization.id_organization;
        }

        if (Object.keys(dataToUpdate).length > 0) {
          await tx.users.update({
            where: { id_user: idTarget },
            data: dataToUpdate,
          });
        }

        if (updateUserDto.contacto_emergencia) {
          const contact = await tx.emergency_contacts.findFirst({
            where: { id_user: idTarget },
          });

          const contactData = {
            contact_name: updateUserDto.contacto_emergencia.nombre_contacto ?? '',
            contact_number: updateUserDto.contacto_emergencia.telefono_contacto ?? '',
          };

          if (contact) {
            await tx.emergency_contacts.update({
              where: { id_contact: contact.id_contact },
              data: contactData,
            });
          } else {
            await tx.emergency_contacts.create({
              data: {
                id_user: idTarget,
                ...contactData,
              },
            });
          }
        }
      });

      return {
        status: 'success',
        message: 'Datos de usuario actualizados correctamente',
        id_target: idTarget,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException({
        status: 'error',
        message: 'Error interno al procesar la actualización de datos.',
      });
    }
  }

  async getUserDetails(idAdmin: string, idTarget: string) {
    await this.validateAdmin(
      idAdmin,
      'No autorizado. Se requiere nivel de acceso de Administrador.',
    );

    try {
      const user = await this.prisma.users.findUnique({
        where: { id_user: idTarget },
        include: {
          emergency_contacts: true,
          organization: true,
        },
      });

      if (!user) {
        throw new NotFoundException({ status: 'error', message: 'Usuario no encontrado.' });
      }

      return {
        status: 'success',
        data: {
          id_user: user.id_user,
          full_name: user.full_name,
          rut: user.rut,
          rol: user.role,
          correo: user.email,
          telefono: user.phone_number,
          organizacion: user.organization?.name ?? null,
          account_status: user.account_status,
          contacto_emergencia:
            user.emergency_contacts.length > 0
              ? {
                  nombre: user.emergency_contacts[0].contact_name,
                  telefono: user.emergency_contacts[0].contact_number,
                }
              : null,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException({
        status: 'error',
        message: 'Error interno al recuperar los datos del perfil.',
      });
    }
  }

  async deleteUser(idAdmin: string, idTarget: string) {
    await this.validateAdmin(idAdmin, 'Acceso denegado. Se requieren permisos de administrador.');

    const user = await this.prisma.users.findUnique({ where: { id_user: idTarget } });
    if (!user) {
      throw new NotFoundException({
        error: 'El usuario con el ID especificado no fue encontrado.',
      });
    }

    try {
      await this.prisma.users.delete({ where: { id_user: idTarget } });

      return {
        message: 'Usuario eliminado correctamente',
        id_usuario: idTarget,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        error: 'Error interno del servidor al intentar eliminar el usuario.',
      });
    }
  }

  async getAllUsers(idAdmin: string) {
    await this.validateAdmin(
      idAdmin,
      'No autorizado. El usuario no tiene permisos de administrador.',
    );

    try {
      const users = await this.prisma.users.findMany({
        include: {
          organization: true,
        },
        orderBy: { full_name: 'asc' },
      });

      return {
        status: 'exitoso',
        total_results: users.length,
        users: users.map((user) => ({
          id_user: user.id_user,
          full_name: user.full_name,
          email: user.email,
          phone_number: user.phone_number,
          rut: user.rut,
          role: user.role,
          status: user.account_status ?? 'sin estado',
          organizacion: user.organization?.name ?? null,
        })),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException({
        error: 'Error interno del servidor al procesar la lista.',
      });
    }
  }

  async getSosAlertsHistory(idAdmin: string, query: DashboardQueryDto) {
    await this.validateAdmin(idAdmin, 'No autorizado. Se requiere nivel de acceso administrativo.');
    const dateRange = this.getDashboardDateRange(query);
    const groupBy = query.group_by ?? 'day';

    const alerts = await this.prisma.location_updates.findMany({
      where: {
        sos_active: 1,
        ...(dateRange
          ? {
              timestamp: {
                gte: dateRange.startDate,
                lt: dateRange.endDate,
              },
            }
          : {}),
      },
      include: {
        users: true,
        route: true,
      },
      orderBy: { timestamp: 'desc' },
    });

    const normalizedAlerts = alerts.map((alert) => ({
      id_location: alert.id_location,
      id_user: alert.id_user,
      full_name: alert.users.full_name,
      id_route: alert.id_route,
      route_name: alert.route.route_name,
      date: this.formatDateKey(alert.timestamp),
      timestamp: alert.timestamp,
      location: {
        latitude: this.decimalToNumber(alert.latitude),
        longitude: this.decimalToNumber(alert.longitude),
      },
    }));

    return {
      status: 'success',
      total_results: normalizedAlerts.length,
      group_by: groupBy,
      series: this.groupDates(
        normalizedAlerts.map((alert) => alert.timestamp),
        groupBy,
      ),
      alerts: normalizedAlerts,
    };
  }

  async getCompletedRoutesHistory(idAdmin: string, query: DashboardQueryDto) {
    await this.validateAdmin(idAdmin, 'No autorizado. Se requiere nivel de acceso administrativo.');
    const dateRange = this.getDashboardDateRange(query);

    const routes = await this.prisma.route.findMany({
      where: {
        ...(dateRange
          ? {
              ending_datetime: {
                gte: dateRange.startDate,
                lt: dateRange.endDate,
              },
            }
          : {}),
        OR: [
          { status: { equals: 'COMPLETED', mode: 'insensitive' } },
          { status: { equals: 'FINALIZADA', mode: 'insensitive' } },
          { status: { equals: 'REALIZADA', mode: 'insensitive' } },
        ],
      },
      include: {
        users: true,
        route_enrollment: true,
      },
      orderBy: { ending_datetime: 'desc' },
    });

    const normalizedRoutes = routes.map((route) => {
      const location = this.getRouteLocation(route);
      const sector = this.getSectorKey(location.latitude, location.longitude);

      return {
        id_route: route.id_route,
        route_name: route.route_name,
        status: route.status,
        date: route.ending_datetime ? this.formatDateKey(route.ending_datetime) : null,
        ending_datetime: route.ending_datetime,
        sector,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          starting_latitude: this.decimalToNumber(route.starting_latitude),
          starting_longitude: this.decimalToNumber(route.starting_longitude),
          ending_latitude: this.decimalToNumber(route.ending_latitude),
          ending_longitude: this.decimalToNumber(route.ending_longitude),
        },
        supervisor: route.users
          ? {
              id_user: route.users.id_user,
              full_name: route.users.full_name,
            }
          : null,
        enrolled_volunteers: route.route_enrollment.length,
      };
    });

    return {
      status: 'success',
      total_results: normalizedRoutes.length,
      group_by: 'sector',
      sectors: this.groupRoutesBySector(normalizedRoutes),
      routes: normalizedRoutes,
    };
  }

  private async validateAdmin(idAdmin: string, message: string) {
    const admin = await this.prisma.users.findUnique({
      where: { id_user: idAdmin },
      select: { role: true },
    });

    if (!admin || admin.role !== 'ADMIN') {
      throw new UnauthorizedException({
        status: 'error',
        message,
      });
    }
  }

  private validateCreateUserDto(createUserDto: CreateUserDto, certificadoFile?: any) {
    const hasRequiredFields =
      this.hasText(createUserDto?.correo_electronico) &&
      this.hasText(createUserDto?.password) &&
      this.hasText(createUserDto?.rol) &&
      this.hasText(createUserDto?.nombre_completo) &&
      this.hasText(createUserDto?.rut) &&
      this.hasText(createUserDto?.organizacion);

    const requiresCertificate = this.shouldRequireCertificate(createUserDto?.rol);
    const hasCertificate =
      this.hasPdfFile(certificadoFile) ||
      (this.hasText(createUserDto?.certificado?.nombre) &&
        this.hasText(createUserDto?.certificado?.contenido));

    if (
      !hasRequiredFields ||
      !this.isValidEmail(createUserDto.correo_electronico) ||
      !ALLOWED_ROLES.has(createUserDto.rol.trim().toUpperCase()) ||
      !this.isValidRut(createUserDto.rut) ||
      (requiresCertificate && !hasCertificate)
    ) {
      throw new NotFoundException({
        status: 'error',
        message: 'El RUT ingresado no es válido o faltan campos.',
      });
    }

    if (certificadoFile && !this.hasPdfFile(certificadoFile)) {
      throw new BadRequestException({
        status: 'error',
        message: 'El certificado debe ser un archivo PDF válido de máximo 5MB.',
      });
    }
  }

  private hasText(value?: string): value is string {
    return typeof value === 'string' && value.trim().length > 0;
  }

  private hasPdfFile(file?: any) {
    if (!file?.buffer || !this.hasText(file.originalname)) {
      return false;
    }

    const isPdfName = file.originalname.toLowerCase().endsWith('.pdf');
    const isPdfMime = file.mimetype === 'application/pdf';
    const hasPdfSignature = file.buffer.subarray(0, 4).toString() === '%PDF';

    return isPdfName && isPdfMime && hasPdfSignature;
  }

  private shouldRequireCertificate(role?: string) {
    return this.hasText(role) && role.trim().toUpperCase() === 'SUPERVISOR';
  }

  private getCertificateData(createUserDto: CreateUserDto, certificadoFile?: any) {
    if (certificadoFile) {
      return {
        nombre: certificadoFile.originalname.trim(),
        contenido: certificadoFile.buffer.toString('base64'),
      };
    }

    return {
      nombre: createUserDto.certificado!.nombre.trim(),
      contenido: this.normalizeBase64(createUserDto.certificado!.contenido),
    };
  }

  private normalizeBase64(value: string) {
    return value.replace(/^data:application\/pdf;base64,/, '').trim();
  }

  private isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  private getDashboardDateRange(query: DashboardQueryDto) {
    if (this.hasText(query.date)) {
      return this.getDateRange(query.date);
    }

    if (!this.hasText(query.from) && !this.hasText(query.to)) {
      return null;
    }

    if (!this.hasText(query.from) || !this.hasText(query.to)) {
      throw new BadRequestException({
        status: 'error',
        message: 'Debe enviar from y to para consultar un rango histórico.',
      });
    }

    return {
      startDate: this.parseDate(query.from),
      endDate: this.addDays(this.parseDate(query.to), 1),
    };
  }

  private getDateRange(date: string) {
    const startDate = this.parseDate(date);
    return {
      startDate,
      endDate: this.addDays(startDate, 1),
    };
  }

  private parseDate(date: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException({
        status: 'error',
        message: 'La fecha debe tener formato YYYY-MM-DD.',
      });
    }

    return new Date(`${date}T00:00:00.000Z`);
  }

  private addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);
    return result;
  }

  private formatDateKey(date: Date) {
    return date.toISOString().split('T')[0];
  }

  private groupDates(dates: Date[], groupBy: 'day' | 'weekday' | 'month') {
    const groups = new Map<string, number>();

    for (const date of dates) {
      const label = this.getDateGroupLabel(date, groupBy);
      groups.set(label, (groups.get(label) ?? 0) + 1);
    }

    return Array.from(groups.entries()).map(([label, count]) => ({ label, count }));
  }

  private getDateGroupLabel(date: Date, groupBy: 'day' | 'weekday' | 'month') {
    if (groupBy === 'month') {
      return date.toISOString().slice(0, 7);
    }

    if (groupBy === 'weekday') {
      return ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][
        date.getUTCDay()
      ];
    }

    return this.formatDateKey(date);
  }

  private groupRoutesBySector(routes: Array<{ sector: string; location: { latitude: number | null; longitude: number | null } }>) {
    const groups = new Map<
      string,
      { sector: string; count: number; location: { latitude: number | null; longitude: number | null } }
    >();

    for (const route of routes) {
      const current = groups.get(route.sector);
      if (current) {
        current.count += 1;
      } else {
        groups.set(route.sector, {
          sector: route.sector,
          count: 1,
          location: route.location,
        });
      }
    }

    return Array.from(groups.values()).sort((a, b) => b.count - a.count);
  }

  private getRouteLocation(route: {
    starting_latitude: unknown;
    starting_longitude: unknown;
    ending_latitude: unknown;
    ending_longitude: unknown;
  }) {
    const latitude =
      this.decimalToNumber(route.ending_latitude) ?? this.decimalToNumber(route.starting_latitude);
    const longitude =
      this.decimalToNumber(route.ending_longitude) ??
      this.decimalToNumber(route.starting_longitude);

    return { latitude, longitude };
  }

  private getSectorKey(latitude: number | null, longitude: number | null) {
    if (latitude === null || longitude === null) {
      return 'sin_ubicacion';
    }

    return `${latitude.toFixed(3)},${longitude.toFixed(3)}`;
  }

  private decimalToNumber(value: unknown) {
    if (value === null || value === undefined) {
      return null;
    }

    return Number(value);
  }

  private normalizeRut(value: string) {
    return value.replace(/\./g, '').toUpperCase();
  }

  private isValidRut(value: string) {
    const rut = this.normalizeRut(value);

    if (!/^\d{7,8}-[\dK]$/.test(rut)) {
      return false;
    }

    const [body, verifier] = rut.split('-');
    let sum = 0;
    let multiplier = 2;

    for (let index = body.length - 1; index >= 0; index -= 1) {
      sum += Number(body[index]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const expectedDigit = 11 - (sum % 11);
    const expected =
      expectedDigit === 11 ? '0' : expectedDigit === 10 ? 'K' : String(expectedDigit);

    return timingSafeEqual(Buffer.from(verifier), Buffer.from(expected));
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
