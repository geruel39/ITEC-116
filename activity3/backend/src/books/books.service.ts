import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { Author } from '../authors/author.entity';
import { Category } from '../categories/category.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private repo: Repository<Book>,
    @InjectRepository(Author) private authorRepo: Repository<Author>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  async create(data: CreateBookDto) {
    // Check author exists
    const author = await this.authorRepo.findOne({ where: { id: data.authorId } });
    if (!author) throw new NotFoundException(`Author with id ${data.authorId} not found`);

    // Check category exists
    const category = await this.categoryRepo.findOne({ where: { id: data.categoryId } });
    if (!category) throw new NotFoundException(`Category with id ${data.categoryId} not found`);

    // Create and save book
    const book = this.repo.create({
      title: data.title,
      description: data.description,
      author,
      category,
    });

    return this.repo.save(book);
  }

  // Include relations in findAll / findOne so Swagger shows nested objects
  findAll() {
    return this.repo.find({ relations: ['author', 'category'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['author', 'category'] });
  }

  async update(id: number, data: UpdateBookDto) {
    const book = await this.findOne(id);
    if (!book) throw new NotFoundException('Book not found');

    if (data.authorId) {
      const author = await this.authorRepo.findOne({ where: { id: data.authorId } });
      if (!author) throw new NotFoundException(`Author with id ${data.authorId} not found`);
      book.author = author;
    }

    if (data.categoryId) {
      const category = await this.categoryRepo.findOne({ where: { id: data.categoryId } });
      if (!category) throw new NotFoundException(`Category with id ${data.categoryId} not found`);
      book.category = category;
    }

    if (data.title !== undefined) book.title = data.title;
    if (data.description !== undefined) book.description = data.description;

    return this.repo.save(book);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}