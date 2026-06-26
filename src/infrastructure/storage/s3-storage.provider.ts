import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageProvider, UploadFileInput } from '../../shared/interfaces/storage-provider.interface';
import { StorageConfig } from '../config/storage.config';

@Injectable()
export class S3StorageProvider implements StorageProvider {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly region: string;
  private readonly endpoint?: string;
  private readonly forcePathStyle: boolean;

  constructor(configService: ConfigService) {
    const config = configService.get<StorageConfig>('storage')!;

    this.bucket = config.bucket;
    this.region = config.region;
    this.endpoint = config.endpoint;
    this.forcePathStyle = config.forcePathStyle;
    this.client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      ...(config.endpoint ? { endpoint: config.endpoint, forcePathStyle: config.forcePathStyle } : {}),
    });
  }

  async upload(input: UploadFileInput): Promise<string> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: input.key,
        Body: input.buffer,
        ContentType: input.contentType,
      }),
    );

    return input.key;
  }

  async download(key: string): Promise<Buffer> {
    const response = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }));
    const bytes = await response.Body!.transformToByteArray();
    return Buffer.from(bytes);
  }

  async delete(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  getPublicUrl(key: string): string {
    if (this.endpoint) {
      return this.forcePathStyle ? `${this.endpoint}/${this.bucket}/${key}` : `${this.endpoint}/${key}`;
    }

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }
}
