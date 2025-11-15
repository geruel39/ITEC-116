import { ApiProperty } from '@nestjs/swagger';

export class PostResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'My first blog post' })
  title: string;

  @ApiProperty({ example: 'This is the content of my first post.' })
  content: string;

  @ApiProperty({ example: 1 })
  user_id: number;

  @ApiProperty({ example: 'johndoe' })
  author_username: string;

  @ApiProperty({ example: '2025-11-15T03:00:00.000Z' })
  created_at: Date;
}

export class PostsListResponseDto {
  @ApiProperty({ type: [PostResponseDto] })
  posts: PostResponseDto[];

  @ApiProperty({ example: 25 })
  total: number;

  @ApiProperty({ example: 1 })
  currentPage: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}