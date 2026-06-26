import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { DashboardQueryDto } from './dto/date-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':id_admin/user/create')
  @UseInterceptors(
    FileInterceptor('certificado', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  createUser(
    @Param('id_admin') idAdmin: string,
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() certificado?: any,
    @Headers('authorization') authorization?: string,
  ) {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException({
        status: 'error',
        message: 'Acceso restringido a administradores.',
      });
    }

    return this.usersService.createUser(idAdmin, createUserDto, certificado);
  }

  @Patch(':id_admin/users/:id_target/edit')
  updateUser(
    @Param('id_admin') idAdmin: string,
    @Param('id_target') idTarget: string,
    @Body() updateUserDto: UpdateUserDto,
    @Headers('authorization') authorization?: string,
  ) {
    this.validateBearer(authorization, 'No autorizado. Se requiere nivel de acceso administrativo.');
    return this.usersService.updateUser(idAdmin, idTarget, updateUserDto);
  }

  @Get(':id_admin/users/:id_target/details')
  getUserDetails(
    @Param('id_admin') idAdmin: string,
    @Param('id_target') idTarget: string,
    @Headers('authorization') authorization?: string,
  ) {
    this.validateBearer(
      authorization,
      'No autorizado. Se requiere nivel de acceso de Administrador.',
    );
    return this.usersService.getUserDetails(idAdmin, idTarget);
  }

  @Delete(':id_admin/users/:id_target/delete')
  deleteUser(
    @Param('id_admin') idAdmin: string,
    @Param('id_target') idTarget: string,
    @Headers('authorization') authorization?: string,
  ) {
    this.validateBearer(authorization, 'Acceso denegado. Se requieren permisos de administrador.');
    return this.usersService.deleteUser(idAdmin, idTarget);
  }

  @Get(':id_admin/users/all')
  getAllUsers(
    @Param('id_admin') idAdmin: string,
    @Headers('authorization') authorization?: string,
  ) {
    this.validateBearer(
      authorization,
      'No autorizado. El usuario no tiene permisos de administrador.',
    );
    return this.usersService.getAllUsers(idAdmin);
  }

  @Get(':id_admin/dashboard/sos-alerts')
  getSosAlertsByDate(
    @Param('id_admin') idAdmin: string,
    @Query() query: DashboardQueryDto,
    @Headers('authorization') authorization?: string,
  ) {
    this.validateBearer(authorization, 'No autorizado. Se requiere nivel de acceso administrativo.');
    return this.usersService.getSosAlertsHistory(idAdmin, query);
  }

  @Get(':id_admin/dashboard/routes-completed')
  getCompletedRoutesByDate(
    @Param('id_admin') idAdmin: string,
    @Query() query: DashboardQueryDto,
    @Headers('authorization') authorization?: string,
  ) {
    this.validateBearer(authorization, 'No autorizado. Se requiere nivel de acceso administrativo.');
    return this.usersService.getCompletedRoutesHistory(idAdmin, query);
  }

  private validateBearer(authorization: string | undefined, message: string) {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException({
        status: 'error',
        message,
      });
    }
  }
}
