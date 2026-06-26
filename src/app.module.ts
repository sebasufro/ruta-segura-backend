import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './admin/users/users.module';
import { DocumentsModule } from './admin/documents/documents.module';

@Module({
  imports: [PrismaModule, UsersModule, DocumentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
