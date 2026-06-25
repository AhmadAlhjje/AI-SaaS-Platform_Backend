import { ConversationEntity } from '../../domain/entities/conversation.entity';

export class ConversationResponse {
  readonly id: string;
  readonly title: string | null;
  readonly createdAt: Date;

  constructor(conversation: ConversationEntity) {
    this.id = conversation.id!;
    this.title = conversation.title;
    this.createdAt = conversation.createdAt;
  }
}
