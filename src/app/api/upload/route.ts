import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { v2 as cloudinary } from 'cloudinary';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  // Cualquier sesión válida (admin o empleado) puede subir imágenes
  const store   = await cookies();
  const session = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 });

  const maxMB = 8;
  if (file.size > maxMB * 1024 * 1024) {
    return NextResponse.json({ error: `Máximo ${maxMB}MB por imagen` }, { status: 400 });
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Solo se aceptan imágenes' }, { status: 400 });
  }

  // Convertir File → Buffer → base64 data URI para Cloudinary
  const buffer  = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder:         'coffee-manual',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  });

  return NextResponse.json({
    url:       result.secure_url,
    publicId:  result.public_id,
    width:     result.width,
    height:    result.height,
  });
}
