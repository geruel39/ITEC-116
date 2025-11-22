import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ example: 1, description: 'ID of the chatroom' })
  roomId: number;

  @ApiProperty({ example: 'Alice', description: 'Sender name' })
  sender: string;

  @ApiProperty({ example: 'Hello!', description: 'Message text' })
  text: string;
}
