/**
 * data-tables only ever needs to download the originally uploaded file to
 * parse it — kept as its own minimal interface (rather than reusing
 * documents' StorageProvider) so this module's infrastructure stays
 * independent of documents' (ROLE.md §7 forbids reaching into another
 * module's infrastructure directly).
 */
export interface DataTableFileDownloader {
  download(key: string): Promise<Buffer>;
}
