import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
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
import { ReprocessDocumentUseCase } from '../../application/use-cases/reprocess-document.use-case';
import { UploadDocumentUseCase } from '../../application/use-cases/upload-document.use-case';
import { ListDocumentsQueryDto } from '../dto/list-documents.query.dto';
import { UploadDocumentDto } from '../dto/upload-document.dto';
import { DocumentResponse } from '../responses/document.response';
import { PaginatedDocumentsResponse } from '../responses/paginated-documents.response';

@Controller('documents')
@UseGuards(JwtAuthGuard, CompanyOwnershipGuard)
export class DocumentsController {
  constructor(
    private readonly uploadDocumentUseCase: UploadDocumentUseCase,
    private readonly getDocumentUseCase: GetDocumentUseCase,
    private readonly listDocumentsUseCase: ListDocumentsUseCase,
    private readonly deleteDocumentUseCase: DeleteDocumentUseCase,
    private readonly reprocessDocumentUseCase: ReprocessDocumentUseCase,
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
  async list(
    @CurrentCompany() companyId: string,
    @Query() query: ListDocumentsQueryDto,
  ): Promise<PaginatedDocumentsResponse> {
    const result = await this.listDocumentsUseCase.execute({
      companyId,
      search: query.search,
      page: query.page,
      limit: query.limit,
    });

    return new PaginatedDocumentsResponse(result);
  }

  @Get(':id')
  async get(@CurrentCompany() companyId: string, @Param('id') documentId: string): Promise<DocumentResponse> {
    const document = await this.getDocumentUseCase.execute({ documentId, companyId });
    return new DocumentResponse(document);
  }

  @Post(':id/reprocess')
  async reprocess(
    @CurrentCompany() companyId: string,
    @Param('id') documentId: string,
  ): Promise<DocumentResponse> {
    const document = await this.reprocessDocumentUseCase.execute({ documentId, companyId });
    return new DocumentResponse(document);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@CurrentCompany() companyId: string, @Param('id') documentId: string): Promise<void> {
    await this.deleteDocumentUseCase.execute({ documentId, companyId });
  }
}
