import { Controller, Post, Body, UseGuards, Request, Param, ParseIntPipe, Get, Patch, Delete, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: { id: number; username: string };
}

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // create comment - authenticated
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: { postId: number; content: string }, @Request() req: RequestWithUser) {
    try {
      const comment = await this.commentsService.create(body.postId, body.content, req.user.id);
      return { success: true, message: 'Comment created', data: comment };
    } catch (err) {
      throw new BadRequestException(err.message || 'Failed to create comment');
    }
  }

  // get comments for a post - public
  @Get('post/:postId')
  async findByPost(@Param('postId', ParseIntPipe) postId: number) {
    try {
      const comments = await this.commentsService.findByPost(postId);
      return { success: true, message: 'Comments retrieved', data: comments };
    } catch (err) {
      throw new BadRequestException(err.message || 'Failed to load comments');
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: { content: string }, @Request() req: RequestWithUser) {
    try {
      const updated = await this.commentsService.update(id, body.content, req.user.id);
      return { success: true, message: 'Comment updated', data: updated };
    } catch (err) {
      if (err.message === 'NOT_FOUND') throw new NotFoundException('Comment not found');
      if (err.message === 'FORBIDDEN') throw new ForbiddenException('Not allowed to edit this comment');
      throw new BadRequestException(err.message || 'Failed to update comment');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req: RequestWithUser) {
    try {
      const deleted = await this.commentsService.remove(id, req.user.id);
      if (!deleted) throw new NotFoundException('Comment not found');
      return { success: true, message: 'Comment deleted' };
    } catch (err) {
      if (err.message === 'NOT_FOUND') throw new NotFoundException('Comment not found');
      if (err.message === 'FORBIDDEN') throw new ForbiddenException('Not allowed to delete this comment');
      throw new BadRequestException(err.message || 'Failed to delete comment');
    }
  }
}
