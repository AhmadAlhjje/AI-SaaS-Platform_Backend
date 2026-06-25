import { registerAs } from '@nestjs/config';

export interface StorageConfig {
  readonly region: string;
  readonly bucket: string;
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  // Set for S3-compatible services (e.g. MinIO); leave unset for real AWS S3.
  readonly endpoint?: string;
  readonly forcePathStyle: boolean;
}

export default registerAs(
  'storage',
  (): StorageConfig => ({
    region: process.env.AWS_REGION!,
    bucket: process.env.AWS_S3_BUCKET!,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    endpoint: process.env.AWS_S3_ENDPOINT,
    forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === 'true',
  }),
);
