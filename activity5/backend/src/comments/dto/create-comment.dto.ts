import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 1, description: 'ID of the post to comment on' })
  @IsInt()
  postId: number;

  @ApiProperty({ example: 'This is a comment.', description: 'Content of the comment' })
  @IsString()
  @MinLength(1)
  content: string;
}