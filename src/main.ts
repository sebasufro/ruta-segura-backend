import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Registramos el filtro global para el manejo de excepciones
  app.useGlobalFilters(new AllExceptionsFilter());

  // Activa la validación automática global para todos los DTOs del sistema
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve automáticamente propiedades del JSON que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza un error si el cliente envía propiedades de más
      transform: true, // Transforma automáticamente los payloads a instancias de sus clases DTO
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();