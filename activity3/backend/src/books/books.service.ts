import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { Author } from '../authors/author.entity';
import { Category } from '../categories/category.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private repo: Repository<Book>,
    @InjectRepository(Author) private authorRepo: Repository<Author>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  async create(data: { title: string; description?: string; authorId: number; categoryId: number }) {
    const author = await this.authorRepo.findOne({ where: { id: data.authorId } });
    const category = await this.categoryRepo.findOne({ where: { id: data.categoryId } });
    if (!author) throw new NotFoundException('Author not found');
    if (!category) throw new NotFoundException('Category not found');

    const book = this.repo.create({ title: data.title, description: data.description, author, category });
    return this.repo.save(book);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<{ title: string; description: string; authorId: number; categoryId: number }>) {
    const book = await this.findOne(id);
    if (!book) throw new NotFoundException('Book not found');

    if (data.authorId) {
      const author = await this.authorRepo.findOne({ where: { id: data.authorId } });
      if (!author) throw new NotFoundException('Author not found');
      book.author = author;
    }
    if (data.categoryId) {
      const category = await this.categoryRepo.findOne({ where: { id: data.categoryId } });
      if (!category) throw new NotFoundException('Category not found');
      book.category = category;
    }
    if (data.title) book.title = data.title;
    if (data.description) book.description = data.description;

    return this.repo.save(book);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
