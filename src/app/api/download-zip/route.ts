import { z } from 'zod';

import { type NextRequest, NextResponse } from 'next/server';

import { downloadArticleZip } from '@/app/actions';

const GenerateImageSchema = z.object({
  topic: z.string().min(3, 'Заголовок должен быть не менее 3 символов'),
  content: z
    .array(z.string().min(1, 'Элемент контента не может быть пустым'))
    .nonempty('Контент не может быть пустым'),
  imageUrl: z.union([
    z.string().url('Некорректный URL изображения'),
    z.undefined(),
  ]),
});

export async function POST(request: NextRequest) {
  try {
    const body: z.infer<typeof GenerateImageSchema> = await request.json();

    const validation = GenerateImageSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 },
      );
    }

    const { zipBuffer, filename } = await downloadArticleZip({
      topic: body.topic,
      content: body.content,
      imageUrl: body.imageUrl,
    });

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error creating ZIP file:', error);
    return NextResponse.json(
      { error: 'Failed to create ZIP file' },
      { status: 500 },
    );
  }
}
