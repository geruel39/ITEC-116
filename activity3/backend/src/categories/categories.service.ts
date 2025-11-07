import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  create(name: string) {
    const c = this.repo.create({ name });
    return this.repo.save(c);
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
