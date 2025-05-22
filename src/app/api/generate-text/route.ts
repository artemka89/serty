import { z } from 'zod';

import { NextResponse } from 'next/server';

import { CONFIG } from '@/shared/model/config';

type ResponseGenerateText = {
  success: boolean;
  result: {
    data: {
      id: string;
      model: string;
      role: string;
      content: string;
      cost: number;
    };
  };
  error: string | null;
  time: number;
};

const GenerateTextSchema = z.object({
  prompt: z.string().min(3, 'Prompt must be at least 3 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = GenerateTextSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 },
      );
    }

    const response = await fetch(`${CONFIG.BASE_API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `ApiKey ${CONFIG.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gemini-1.5-flash-8b-latest',
        max_tokens: 2048,
        temperature: 0,
        context: [
          {
            role: 'user',
            content: validation.data.prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error from API: ${errorData.message || response.statusText}`,
      );
    }

    const remoteData: ResponseGenerateText = await response.json();

    return NextResponse.json(
      { data: remoteData.result.data.content },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: 'Serever error' }, { status: 500 });
  }
}
