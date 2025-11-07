import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async register(username: string, password: string) {
    // Check if username exists
    const existing = await this.repo.findOne({ where: { username } });
    if (existing) {
      throw new ConflictException('Username already exists');
    }

    // Create new user
    const user = this.repo.create({ username, password });
    return this.repo.save(user);
  }

  async login(username: string, password: string) {
    const user = await this.repo.findOne({ where: { username, password } });
    if (!user) throw new Error('Invalid credentials');
    return user;
    }


  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }
}
