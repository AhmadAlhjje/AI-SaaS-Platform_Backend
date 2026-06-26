import { ConversationEntity } from '../entities/conversation.entity';

export interface ConversationRepository {
  findById(id: string): Promise<ConversationEntity | null>;
  findAllByCompanyId(companyId: string): Promise<ConversationEntity[]>;
  create(conversation: ConversationEntity): Promise<ConversationEntity>;
  /** Hard delete — messages cascade via the FK (schema.prisma Message.conversation onDelete: Cascade). */
  delete(id: string): Promise<void>;
}
