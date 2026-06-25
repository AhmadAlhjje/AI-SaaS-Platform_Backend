import { MessageEntity } from '../entities/message.entity';

export interface MessageRepository {
  findAllByConversationId(conversationId: string): Promise<MessageEntity[]>;
  create(message: MessageEntity): Promise<MessageEntity>;
}
