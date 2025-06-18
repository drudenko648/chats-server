import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';

export const DOC_RELATIVE_PATH = '/async-api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const PORT = process.env.PORT ?? 3000

  const asyncApiOptions = new AsyncApiDocumentBuilder()
    .setTitle('Chats')
    .setDescription('Chats gateway')
    .setVersion('1.0')
    .setDefaultContentType('application/json')
    .addServer('chats-ws', {
      url: `ws://localhost:${PORT}`,
      protocol: 'socket.io',
    })
    .build();

  const asyncapiDocument = AsyncApiModule.createDocument(app, asyncApiOptions);
  await AsyncApiModule.setup(DOC_RELATIVE_PATH, app, asyncapiDocument);

  await app.listen(PORT, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
void bootstrap();
