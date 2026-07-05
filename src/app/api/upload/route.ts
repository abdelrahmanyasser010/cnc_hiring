// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

import { uploadRateLimiter } from '@/infrastructure/container';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = await uploadRateLimiter.limitRequest(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'لقد تجاوزت الحد الأقصى المسموح به لرفع الملفات. يرجى المحاولة لاحقاً.' },
        { status: 429 }
      );
    }
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // Dev mode: return mock URL if using placeholder
    if (!cloudName || cloudName === 'placeholder_cloud_name') {
      return NextResponse.json({ 
        url: 'https://placeholder.example.com/business-license.pdf',
        isMock: true 
      });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'لم يتم تحديد ملف' }, { status: 400 });
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'حجم الملف يتجاوز 10 ميجابايت' }, { status: 400 });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const folder = 'hiring_cnc/licenses';
    
    // Generate signature
    const signatureStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');

    // Build upload form
    const uploadForm = new FormData();
    uploadForm.append('file', file);
    uploadForm.append('api_key', apiKey!);
    uploadForm.append('timestamp', timestamp.toString());
    uploadForm.append('signature', signature);
    uploadForm.append('folder', folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      { method: 'POST', body: uploadForm }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Cloudinary error:', error);
      return NextResponse.json({ error: 'فشل رفع الملف، يرجى المحاولة لاحقاً' }, { status: 500 });
    }

    const result = await response.json();
    return NextResponse.json({ url: result.secure_url });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم أثناء رفع الملف' }, { status: 500 });
  }
}
