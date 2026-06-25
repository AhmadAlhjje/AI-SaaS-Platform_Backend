import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentCompany } from '../../../../shared/decorators/current-company.decorator';
import { CompanyOwnershipGuard } from '../../../../shared/guards/company-ownership.guard';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { DeleteDocumentUseCase } from '../../application/use-cases/delete-document.use-case';
import { GetDocumentUseCase } from '../../application/use-cases/get-document.use-case';
import { ListDocumentsUseCase } from '../../application/use-cases/list-documents.use-case';
import { UploadDocumentUseCase } from '../../application/use-cases/upload-document.use-case';
import { UploadDocumentDto } from '../dto/upload-document.dto';
import { DocumentResponse } from '../responses/document.response';

@Controller('documents')
@UseGuards(JwtAuthGuard, CompanyOwnershipGuard)
export class DocumentsController {
  constructor(
    private readonly uploadDocumentUseCase: UploadDocumentUseCase,
    private readonly getDocumentUseCase: GetDocumentUseCase,
    private readonly listDocumentsUseCase: ListDocumentsUseCase,
    private readonly deleteDocumentUseCase: DeleteDocumentUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @CurrentCompany() companyId: string,
    @Body() dto: UploadDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<DocumentResponse> {
    const document = await this.uploadDocumentUseCase.execute({
      companyId,
      fileName: file.originalname,
      fileType: file.mimetype,
      knowledgeType: dto.knowledgeType,
      buffer: file.buffer,
    });

    return new DocumentResponse(document);
  }

  @Get()
  async list(@CurrentCompany() companyId: string): Promise<DocumentResponse[]> {
    const documents = await this.listDocumentsUseCase.execute({ companyId });
    return documents.map((document) => new DocumentResponse(document));
  }

  @Get(':id')
  async get(@CurrentCompany() companyId: string, @Param('id') documentId: string): Promise<DocumentResponse> {
    const document = await this.getDocumentUseCase.execute({ documentId, companyId });
    return new DocumentResponse(document);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@CurrentCompany() companyId: string, @Param('id') documentId: string): Promise<void> {
    await this.deleteDocumentUseCase.execute({ documentId, companyId });
  }
}
