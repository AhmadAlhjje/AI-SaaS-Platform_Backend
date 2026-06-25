import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  knowledgeType!: string;
}
