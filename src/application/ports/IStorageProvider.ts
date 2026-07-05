// src/application/ports/IStorageProvider.ts
// Port: File storage contract (ADR-004)
// Implementations: Cloudinary, S3, Local

export interface UploadOptions {
  folder?: string;
  allowedTypes?: string[]; // e.g. ['image/jpeg', 'application/pdf']
  maxSizeBytes?: number;
}

export interface UploadResult {
  url: string;
  publicId: string;
  bytes: number;
  format: string;
}

export interface IStorageProvider {
  upload(file: File | Buffer, options?: UploadOptions): Promise<UploadResult>;
  delete(publicId: string): Promise<void>;
  getSignedUrl(publicId: string, expiresInSeconds?: number): Promise<string>;
}
