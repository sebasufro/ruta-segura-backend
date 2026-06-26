import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const { email, password, rut, role, full_name, phone_number, address, emergency_contact, organization, id_legal_person, certificate } = signInDto;

    const existingUser = await this.prisma.users.findFirst({
      where: {
        OR: [{ email }, { rut }],
      },
    });

    if (existingUser) {
      throw new ConflictException({
        status: 'error',
        code: 'USER_ALREADY_EXISTS',
        message: 'El correo electrónico o el RUT ya se encuentran registrados en el sistema',
        target: existingUser.email === email ? 'correo_electronico' : 'rut'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let createdOrgId: string | null = null;

    if (organization) {
      const org = await this.prisma.organization.create({
        data: {
          name: organization,
          id_legal_person,
          organization_documents: certificate ? {
            create: {
              file_name: certificate.name,
              content_base64: certificate.content,
              document_status: 'Pendiente'
            }
          } : undefined
        }
      });
      createdOrgId = org.id_organization;
    }

    const newUser = await this.prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        rut,
        role,
        full_name,
        phone_number,
        id_organization: createdOrgId,
        user_addresses: address ? {
          create: {
            alias: 'Principal',
            full_address: address
          }
        } : undefined,
        emergency_contacts: emergency_contact ? {
          create: {
            contact_name: emergency_contact.contact_name,
            contact_number: emergency_contact.contact_number
          }
        } : undefined
      },
    });

    return {
      status: 'success',
      message: 'Usuario registrado exitosamente',
      data: {
        id_user: newUser.id_user,
        email: newUser.email,
        rol: newUser.role,
        created_in: new Date()
      }
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.users.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException({ error: 'correo o contraseña incorrectos.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException({ error: 'correo o contraseña incorrectos.' });
    }

    const payload = { email: user.email, id_user: user.id_user, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      token,
      rol: user.role,
      id_user: user.id_user,
    };
  }
}
