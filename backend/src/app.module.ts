import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './module/item.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            callback(null, `${uniqueSuffix}${ext}`);
          },
        }),
      }),
    }),
    ItemModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'DATABASE_CONNECTION',
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<typeof mongoose> => {
        try {
          const dbPassword = configService.get<string>('DB_PASSWORD');

          const uri = `mongodb+srv://itemManager:${dbPassword}@itemmanager.5frdf.mongodb.net/?retryWrites=true&w=majority`;

          const connection = await mongoose.connect(uri);
          return connection;
        } catch (error) {
          console.error('Erro ao conectar ao MongoDB Atlas:', error);
          throw error;
        }
      },
    },
  ],
})
export class AppModule {}
