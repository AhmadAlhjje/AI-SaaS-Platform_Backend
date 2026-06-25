export interface UploadFileInput {
  readonly key: string;
  readonly buffer: Buffer;
  readonly contentType: string;
}

export interface StorageProvider {
  /** Stores the file and returns the object key persisted as Document.fileUrl. */
  upload(input: UploadFileInput): Promise<string>;
  delete(key: string): Promise<void>;
}
