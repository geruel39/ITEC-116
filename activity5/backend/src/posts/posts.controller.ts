import { Controller, Post, Body, UseGuards, Request, Get, Query, ParseIntPipe, DefaultValuePipe, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponse, PostsListResponse } from './interfaces/post.interface';

interface RequestWithUser extends Request {
  user: { id: number; username: string };
}

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createPostDto: CreatePostDto, @Request() req: RequestWithUser): Promise<PostResponse> {
    try {
      return await this.postsService.create(createPostDto, req.user.id);
    } catch (err) {
      throw new BadRequestException(err.message || 'Failed to create post');
    }
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number
  ): Promise<PostsListResponse> {
    try {
      return await this.postsService.findAll(page, limit);
    } catch (err) {
      throw new BadRequestException(err.message || 'Failed to retrieve posts');
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
      return await this.postsService.update(id, updatePostDto, req.user.id);
    } catch (err) {
      throw err;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req: RequestWithUser): Promise<PostResponse> {
    try {
      return await this.postsService.remove(id, req.user.id);
    } catch (err) {
      throw err;
    }
  }
}