import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    
    // Si es un error controlado (HttpException), tomamos su status, si no, 500
    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException 
      ? exception.getResponse() 
      : 'Error interno del servidor';

    // Logueo centralizado: Todo error pasa por aquí
    console.error('--- ERROR DETECTADO ---', exception);

    response.status(status).json({
      status: 'error',
      message: message,
      timestamp: new Date().toISOString(),
    });
  }
}