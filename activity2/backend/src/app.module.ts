import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Note } from './note/note.entity';
import { UserModule } from './user/user.module';
import { NotesModule } from './note/notes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'act2',
      entities: [User, Note],
      synchronize: true,
    }),
    UserModule,
    NotesModule,
  ],
})
export class AppModule {}
