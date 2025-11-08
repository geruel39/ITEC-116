import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  content: string;
}