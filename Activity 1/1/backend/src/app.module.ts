import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '', // 🔧 your password
      database: 'act1',
      autoLoadEntities: true,
      synchronize: true, // auto create table
    }),
    TodoModule,
  ],
})
export class AppModule {}
