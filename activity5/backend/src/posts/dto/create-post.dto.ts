import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ 
    example: 'My First Blog Post', 
    description: 'The title of the blog post' 
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({ 
    example: 'This is the content of the blog post.', 
    description: 'The main body/content of the blog post' 
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  content: string;
}