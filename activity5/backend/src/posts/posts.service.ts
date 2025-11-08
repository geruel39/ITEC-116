import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePostDto } from './dto/create-post.dto';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface Post extends RowDataPacket {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: Date;
  author_username?: string;
}

interface CountResult extends RowDataPacket {
  count: number;
}

@Injectable()
export class PostsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    const { title, content } = createPostDto;
    try {
      const result = await this.databaseService.query<ResultSetHeader>(
        'INSERT INTO posts (title, content, user_id, created_at) VALUES (?, ?, ?, NOW())',
        [title, content, userId]
      );
      
      if (result.affectedRows > 0) {
        const posts = await this.databaseService.query<Post[]>(
          'SELECT p.*, a.username as author_username FROM posts p LEFT JOIN accounts a ON p.user_id = a.userID WHERE p.id = ?',
          [result.insertId]
        );
        return posts[0];
      }
      return null;
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error('Failed to create post. Please ensure you are logged in.');
    }
  }

  async findAll(page: number = 1, limit: number = 5) {
    const offset = (page - 1) * limit;
    
    const countResult = await this.databaseService.query<CountResult[]>(
      'SELECT COUNT(*) as count FROM posts'
    );
    const total = countResult[0].count;

    const posts = await this.databaseService.query<Post[]>(
      `SELECT p.*, a.username as author_username 
       FROM posts p 
       LEFT JOIN accounts a ON p.user_id = a.userID 
       ORDER BY p.created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return {
      posts,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findById(id: number) {
    const posts = await this.databaseService.query<Post[]>(
      'SELECT p.*, a.username as author_username FROM posts p LEFT JOIN accounts a ON p.user_id = a.userID WHERE p.id = ?',
      [id]
    );
    return posts[0] || null;
  }

  async update(id: number, updateData: { title: string; content: string }, userId: number) {
    const post = await this.findById(id);
    if (!post) {
      throw new Error('NOT_FOUND');
    }
    if (post.user_id !== userId) {
      throw new Error('FORBIDDEN');
    }

    await this.databaseService.query(
      'UPDATE posts SET title = ?, content = ? WHERE id = ?',
      [updateData.title, updateData.content, id]
    );

    return this.findById(id);
  }

  async remove(id: number, userId: number) {
    const post = await this.findById(id);
    if (!post) {
      throw new Error('NOT_FOUND');
    }
    if (post.user_id !== userId) {
      throw new Error('FORBIDDEN');
    }

    const result = await this.databaseService.query<ResultSetHeader>(
      'DELETE FROM posts WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  }
}