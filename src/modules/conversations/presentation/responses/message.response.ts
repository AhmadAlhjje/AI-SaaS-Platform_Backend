import { MessageEntity } from '../../domain/entities/message.entity';

export class MessageResponse {
  readonly id: string;
  readonly senderType: string;
  readonly content: string;
  readonly createdAt: Date;

  constructor(message: MessageEntity) {
    this.id = message.id!;
    this.senderType = message.senderType;
    this.content = message.content;
    this.createdAt = message.createdAt;
  }
}
