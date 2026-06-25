import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageConfig } from '../../../../infrastructure/config/storage.config';
import { DataTableFileDownloader } from '../../domain/interfaces/file-downloader.interface';

/**
 * Own minimal S3 client rather than reaching into documents'
 * S3StorageProvider/infrastructure — `storage.config` is global infra
 * (like AI module's `ai-service.config`), but the concrete provider class
 * stays module-local per ROLE.md §7.
 */
@Injectable()
export class S3DataTableDownloaderProvider implements DataTableFileDownloader {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(configService: ConfigService) {
    const config = configService.get<StorageConfig>('storage')!;

    this.bucket = config.bucket;
    this.client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      ...(config.endpoint ? { endpoint: config.endpoint, forcePathStyle: config.forcePathStyle } : {}),
    });
  }

  async download(key: string): Promise<Buffer> {
    const response = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }));
    const bytes = await response.Body!.transformToByteArray();
    return Buffer.from(bytes);
  }
}
