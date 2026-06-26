import { IsNotEmpty, IsString } from 'class-validator';

export class ActivateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  planId!: string;
}
