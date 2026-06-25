import { MessageEntity } from '../../domain/entities/message.entity';
import { MessageResponse } from './message.response';

export class SendMessageResponse {
  readonly userMessage: MessageResponse;
  readonly aiMessage: MessageResponse | null;

  constructor(userMessage: MessageEntity, aiMessage: MessageEntity | null) {
    this.userMessage = new MessageResponse(userMessage);
    this.aiMessage = aiMessage ? new MessageResponse(aiMessage) : null;
  }
}
