import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DomainEvent } from './domain-event.interface';

@Injectable()
export class EventBus {
  constructor(private readonly emitter: EventEmitter2) {}

  publish<TEvent extends DomainEvent>(eventName: string, event: TEvent): void {
    this.emitter.emit(eventName, event);
  }
}
