import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePostDto } from './dto/create-post.dto';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { PostResponse, PostsListResponse } from './interfaces/post.interface';

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

  async create(createPostDto: CreatePostDto, userId: number): Promise<PostResponse> {
    const { title, content } = createPostDto;

    const result = await this.databaseService.query<ResultSetHeader>(
      'INSERT INTO posts (title, content, user_id, created_at) VALUES (?, ?, ?, NOW())',
      [title, content, userId]
    );

    if (result.affectedRows === 0) throw new BadRequestException('Failed to create post');

    const [post] = await this.databaseService.query<Post[]>(
      'SELECT p.*, a.username AS author_username FROM posts p LEFT JOIN accounts a ON p.user_id = a.userID WHERE p.id = ?',
      [result.insertId]
    );

    if (!post) throw new NotFoundException('Post not found after creation');

    return {
      success: true,
      message: 'Post created successfully',
      data: post,
    };
  }

  async findAll(page: number = 1, limit: number = 5): Promise<PostsListResponse> {
    const offset = (page - 1) * limit;

    const [countResult] = await this.databaseService.query<CountResult[]>('SELECT COUNT(*) AS count FROM posts');
    const total = countResult.count;

    const posts = await this.databaseService.query<Post[]>(
      `SELECT p.*, a.username AS author_username
       FROM posts p
       LEFT JOIN accounts a ON p.user_id = a.userID
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return {
      success: true,
      message: 'Posts retrieved successfully',
      data: {
        posts,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number): Promise<PostResponse> {
    const [post] = await this.databaseService.query<Post[]>(
      'SELECT p.*, a.username AS author_username FROM posts p LEFT JOIN accounts a ON p.user_id = a.userID WHERE p.id = ?',
      [id]
    );

    if (!post) throw new NotFoundException('Post not found');

    return {
      success: true,
      message: 'Post retrieved successfully',
      data: post,
    };
  }

  async update(id: number, updateData: CreatePostDto, userId: number): Promise<PostResponse> {
    const postResp = await this.findById(id);
    const post = postResp.data!; // Non-null assertion

    if (post.user_id !== userId) throw new ForbiddenException('You are not allowed to edit this post');

    await this.databaseService.query(
      'UPDATE posts SET title = ?, content = ? WHERE id = ?',
      [updateData.title, updateData.content, id]
    );

    return this.findById(id);
  }

  async remove(id: number, userId: number): Promise<PostResponse> {
    const postResp = await this.findById(id);
    const post = postResp.data!; // Non-null assertion

    if (post.user_id !== userId) throw new ForbiddenException('You are not allowed to delete this post');

    const result = await this.databaseService.query<ResultSetHeader>(
      'DELETE FROM posts WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) throw new NotFoundException('Post not found');

    return {
      success: true,
      message: 'Post deleted successfully',
      data: post,
    };
  }
}