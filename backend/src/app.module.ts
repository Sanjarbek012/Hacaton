import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicsModule } from './topics/topics.module';
import { ResultsModule } from './results/results.module';
import { AuthModule } from './auth/auth.module';
import { AiModule } from './ai/ai.module';
import { ChemModule } from './chem/chem.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({
        type: 'postgres' as const,
        host: c.get<string>('DB_HOST', 'localhost'),
        port: Number(c.get('DB_PORT', '5432')),
        username: c.get<string>('DB_USER', 'postgres'),
        password: c.get<string>('DB_PASS', 'postgres'),
        database: c.get<string>('DB_NAME', 'virtual_lab'),
        autoLoadEntities: true,
        synchronize: c.get('DB_SYNC', 'true') === 'true',
      }),
    }),
    AuthModule,
    TopicsModule,
    ResultsModule,
    StatsModule,
    ChemModule,
    AiModule,
  ],
})
export class AppModule {}
