import { ApiProperty } from '@nestjs/swagger';

export class CreateChatroomDto {
  @ApiProperty({ example: 'General', description: 'Name of the chatroom' })
  name: string;
}
