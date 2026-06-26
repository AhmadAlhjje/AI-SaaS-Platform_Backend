export interface UploadFileInput {
  readonly key: string;
  readonly buffer: Buffer;
  readonly contentType: string;
}

export interface StorageProvider {
  /** Stores the file and returns the object key persisted as Document.fileUrl / Company.logo. */
  upload(input: UploadFileInput): Promise<string>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  /** Browser-loadable URL for a previously uploaded key — only meaningful for public assets like a company logo. */
  getPublicUrl(key: string): string;
}
