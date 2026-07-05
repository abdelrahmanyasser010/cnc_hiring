// src/infrastructure/adapters/CloudinaryStorageAdapter.ts
// Adapter: Cloudinary file storage (ADR-004, Phase 8)
// Swap for S3Adapter/LocalStorageAdapter without changing StorageService

import crypto from "crypto";
import type {
  IStorageProvider,
  UploadOptions,
  UploadResult,
} from "@/application/ports/IStorageProvider";

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME ?? "";
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY ?? "";
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET ?? "";
const IS_PLACEHOLDER =
  !CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME === "placeholder_cloud_name";

export class CloudinaryStorageAdapter implements IStorageProvider {
  async upload(file: File, options: UploadOptions = {}): Promise<UploadResult> {
    // Dev mode: return mock result if credentials not configured
    if (IS_PLACEHOLDER) {
      return {
        url: `https://placeholder.hirecnc.com/uploads/${Date.now()}.pdf`,
        publicId: `mock_${Date.now()}`,
        bytes: file.size,
        format: file.type.split("/")[1] ?? "bin",
      };
    }

    // Validate file type if allowedTypes specified
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      throw new Error(`نوع الملف غير مسموح به. الأنواع المقبولة: ${options.allowedTypes.join(", ")}`);
    }

    // Validate file size
    const maxSize = options.maxSizeBytes ?? 10 * 1024 * 1024; // Default 10MB
    if (file.size > maxSize) {
      throw new Error(`حجم الملف يتجاوز الحد المسموح به (${Math.round(maxSize / 1024 / 1024)} ميجابايت)`);
    }

    const folder = options.folder ?? "hiring_cnc/uploads";
    const timestamp = Math.round(Date.now() / 1000);

    // Generate HMAC-SHA1 signature
    const signStr = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = crypto.createHash("sha1").update(signStr).digest("hex");

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", CLOUDINARY_API_KEY);
    form.append("timestamp", timestamp.toString());
    form.append("signature", signature);
    form.append("folder", folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
      { method: "POST", body: form }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Cloudinary upload failed: ${(err as { error?: { message?: string } }).error?.message ?? res.statusText}`);
    }

    const data = await res.json() as {
      secure_url: string;
      public_id: string;
      bytes: number;
      format: string;
    };

    return {
      url: data.secure_url,
      publicId: data.public_id,
      bytes: data.bytes,
      format: data.format,
    };
  }

  async delete(publicId: string): Promise<void> {
    if (IS_PLACEHOLDER) return;

    const timestamp = Math.round(Date.now() / 1000);
    const signStr = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = crypto.createHash("sha1").update(signStr).digest("hex");

    const form = new FormData();
    form.append("public_id", publicId);
    form.append("api_key", CLOUDINARY_API_KEY);
    form.append("timestamp", timestamp.toString());
    form.append("signature", signature);

    await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
      { method: "POST", body: form }
    );
  }

  async getSignedUrl(publicId: string): Promise<string> {
    if (IS_PLACEHOLDER) return `https://placeholder.hirecnc.com/${publicId}`;
    // For Cloudinary, public URLs are sufficient for our use case
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
  }
}

export const storageProvider = new CloudinaryStorageAdapter();
