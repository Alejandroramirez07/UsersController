import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/global-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Configuración de swagger
  const configDoc = new DocumentBuilder()
    .setTitle('API MujeresDigitales2025')
    .setDescription('Documentación de la API desarrollada en NestJS para MujeresDigitales2025')
    .setVersion('2.5')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, configDoc);
  SwaggerModule.setup('api/docs', app, document)

  app.useGlobalFilters(new AllExceptionsFilter());//Habilitar el filtro global de excepciones

  //Habilitar la validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
