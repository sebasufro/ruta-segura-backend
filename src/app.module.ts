import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'rut453gur4!',
      database: 'rutaSegura',
      autoLoadEntities: true, // Carga automáticamente las entidades registradas en los submódulos
      synchronize: false, // Es una buena práctica mantenerlo en 'false' si ya creaste tus tablas manualmente con tu script SQL
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}