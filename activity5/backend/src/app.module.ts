import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'todo.db',
      autoLoadEntities: true,
      synchronize: true, // ⚠️ for dev only
    }),
    TodoModule,
  ],
})
export class AppModule {}
