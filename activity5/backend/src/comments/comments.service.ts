import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Comment extends RowDataPacket {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: Date;
  author_username?: string;
}

@Injectable()
export class CommentsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(postId: number, content: string, userId: number) {
    const result = await this.databaseService.query<ResultSetHeader>(
      'INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())',
      [postId, userId, content]
    );

    if (result.affectedRows > 0) {
      const rows = await this.databaseService.query<Comment[]>(
        'SELECT c.*, a.username as author_username FROM comments c LEFT JOIN accounts a ON c.user_id = a.userID WHERE c.id = ?',
        [result.insertId]
      );
      return rows[0];
    }
    return null;
  }

  async findByPost(postId: number) {
    const rows = await this.databaseService.query<Comment[]>(
      'SELECT c.*, a.username as author_username FROM comments c LEFT JOIN accounts a ON c.user_id = a.userID WHERE c.post_id = ? ORDER BY c.created_at ASC',
      [postId]
    );
    return rows;
  }

  async findById(id: number) {
    const rows = await this.databaseService.query<Comment[]>(
      'SELECT c.*, a.username as author_username FROM comments c LEFT JOIN accounts a ON c.user_id = a.userID WHERE c.id = ?',
      [id]
    );
    return rows[0] || null;
  }

  async update(id: number, content: string, userId: number) {
    const comment = await this.findById(id);
    if (!comment) throw new Error('NOT_FOUND');
    if (comment.user_id !== userId) throw new Error('FORBIDDEN');

    await this.databaseService.query('UPDATE comments SET content = ? WHERE id = ?', [content, id]);
    return this.findById(id);
  }

  async remove(id: number, userId: number) {
    const comment = await this.findById(id);
    if (!comment) throw new Error('NOT_FOUND');
    if (comment.user_id !== userId) throw new Error('FORBIDDEN');

    const result = await this.databaseService.query<ResultSetHeader>('DELETE FROM comments WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}
