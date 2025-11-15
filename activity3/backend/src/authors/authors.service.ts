import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './author.entity';

@Injectable()
export class AuthorsService {
  constructor(@InjectRepository(Author) private repo: Repository<Author>) {}

  create(name: string) {
    const author = this.repo.create({ name });
    return this.repo.save(author);
  }

  findAll() {
    return this.repo.find({ relations: ['books'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['books'] });
  }

  async update(id: number, name: string) {
    await this.repo.update(id, { name });
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}