import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  UseGuards, 
  Request, 
  Query, 
  BadRequestException,
  NotFoundException,
  ParseIntPipe,
  DefaultValuePipe,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
  // @ApiTags('posts')
import { PostResponse, PostsListResponse } from './interfaces/post.interface';
import { Patch, Param, Delete, ForbiddenException } from '@nestjs/common';

interface RequestWithUser extends Request {
  user: {
    id: number;
    // @ApiBearerAuth('JWT')
    // @ApiOperation({ summary: 'Create a new post' })
    // @ApiResponse({ status: 201, description: 'Post created' })
    username: string;
  };
}

@Controller('posts')
@UsePipes(new ValidationPipe({ transform: true }))
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createPostDto: CreatePostDto,
    @Request() req: RequestWithUser
  ): Promise<PostResponse> {
    try {
      const post = await this.postsService.create(createPostDto, req.user.id);
      if (!post) {
        throw new BadRequestException('Failed to create post');
      }
    // @ApiOperation({ summary: 'Get paginated list of posts' })
      return {
        success: true,
        message: 'Post created successfully',
        data: post
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to create post');
    }
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number
  ): Promise<PostsListResponse> {
    try {
      const result = await this.postsService.findAll(page, limit);
      
      if (!result.posts.length && page > 1) {
        throw new NotFoundException('No posts found for this page');
      }

      return {
        success: true,
        message: 'Posts retrieved successfully',
        data: result
    // @ApiBearerAuth('JWT')
    // @ApiOperation({ summary: 'Update a post (owner only)' })
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Failed to retrieve posts');
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: CreatePostDto,
    @Request() req: RequestWithUser
  ): Promise<PostResponse> {
    try {
      const updated = await this.postsService.update(id, updatePostDto, req.user.id);
      return {
        success: true,
        message: 'Post updated successfully',
        data: updated,
      };
    } catch (error) {
      if (error.message === 'NOT_FOUND') {
    // @ApiBearerAuth('JWT')
    // @ApiOperation({ summary: 'Delete a post (owner only)' })
        throw new NotFoundException('Post not found');
      }
      if (error.message === 'FORBIDDEN') {
        throw new ForbiddenException('You are not allowed to edit this post');
      }
      throw new BadRequestException(error.message || 'Failed to update post');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequestWithUser
  ): Promise<PostResponse> {
    try {
      const deleted = await this.postsService.remove(id, req.user.id);
      if (!deleted) {
        throw new NotFoundException('Post not found');
      }
      return {
        success: true,
        message: 'Post deleted successfully',
        data: null,
      };
    } catch (error) {
      if (error.message === 'NOT_FOUND') {
        throw new NotFoundException('Post not found');
      }
      if (error.message === 'FORBIDDEN') {
        throw new ForbiddenException('You are not allowed to delete this post');
      }
      throw new BadRequestException(error.message || 'Failed to delete post');
    }
  }
}