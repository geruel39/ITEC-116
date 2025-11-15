import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from '../books/book.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column()
  @ApiProperty({ example: 'J.K. Rowling' })
  name: string;

  @OneToMany(() => Book, (book) => book.author)
  @ApiProperty({ type: () => [Book], description: 'Books written by the author' })
  books: Book[];
}