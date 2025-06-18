import { ApiProperty } from '@nestjs/swagger';

export class JoinChatDto {
  @ApiProperty()
  chatId: string;
}
