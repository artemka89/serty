import { resolve } from 'path';
import { z } from 'zod';

import { NextResponse } from 'next/server';

import { CONFIG } from '@/shared/model/config';

type ResponseGenerateImage = {
  success: boolean;
  result: {
    data: {
      model: string;
      created: number;
      data: {
        b64_json: string | null;
        revised_prompt: string;
        url: string;
      }[];
    };
    cost: number;
  };
  error: null;
  time: number;
};

const GenerateImageSchema = z.object({
  prompt: z.string().min(3, 'Prompt must be at least 3 characters'),
  size: z.enum(['256x256', '512x512', '1024x1024']),
});

export async function POST(request: Request) {
  try {
    const body: z.infer<typeof GenerateImageSchema> = await request.json();

    const validation = GenerateImageSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 },
      );
    }

    const response = await fetch(`${CONFIG.BASE_API_URL}/chat-dalle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `ApiKey ${CONFIG.DALLE_API_KEY}`,
      },
      body: JSON.stringify({
        ...body,
        model: 'dall-e-2',
        quality: 'standard',
        style: 'natural',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error from API: ${errorData.message || response.statusText}`,
      );
    }

    const remoteData: ResponseGenerateImage = await response.json();

    return NextResponse.json(
      { url: remoteData.result.data.data[0].url },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: 'Serever error' }, { status: 500 });
  }
}
