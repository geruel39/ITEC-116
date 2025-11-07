import { Module } from '@nestjs/common';
// Tell TypeScript the NodeJS __dirname exists in this runtime environment
declare const __dirname: string;
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { AuthorsModule } from './authors/authors.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    BooksModule,
    AuthorsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
