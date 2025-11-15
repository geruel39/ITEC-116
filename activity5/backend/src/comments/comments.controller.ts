import { Controller, Post, Body, UseGuards, Request, Param, ParseIntPipe, Get, Patch, Delete, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

interface RequestWithUser extends Request {
  user: { id: number; username: string };
}

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create a comment on a post' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  async create(@Body() dto: CreateCommentDto, @Request() req: RequestWithUser) {
    try {
      const comment = await this.commentsService.create(dto.postId, dto.content, req.user.id);
      return { success: true, message: 'Comment created', data: comment };
    } catch (err) {
      throw new BadRequestException(err.message || 'Failed to create comment');
    }
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get all comments for a post' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
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
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update a comment' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommentDto,
    @Request() req: RequestWithUser
  ) {
    try {
      const updated = await this.commentsService.update(id, dto.content, req.user.id);
      return { success: true, message: 'Comment updated', data: updated };
    } catch (err) {
      if (err.message === 'NOT_FOUND') throw new NotFoundException('Comment not found');
      if (err.message === 'FORBIDDEN') throw new ForbiddenException('Not allowed to edit this comment');
      throw new BadRequestException(err.message || 'Failed to update comment');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Delete a comment' })
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