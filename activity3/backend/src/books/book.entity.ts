import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Author } from '../authors/author.entity';
import { Category } from '../categories/category.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column()
  @ApiProperty({ example: 'The Hobbit' })
  title: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'A fantasy adventure', required: false })
  description: string;

  @ManyToOne(() => Author, (author) => author.books, { eager: true })
  @ApiProperty({ type: () => Author, description: 'Author of the book' })
  author: Author;

  @ManyToOne(() => Category, (category) => category.books, { eager: true })
  @ApiProperty({ type: () => Category, description: 'Category of the book' })
  category: Category;
}