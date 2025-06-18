import { ApiProperty } from '@nestjs/swagger';

export class LeaveChatDto {
  @ApiProperty()
  chatId: string;
}
