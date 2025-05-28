'use client';

import { FC } from 'react';

import Image from 'next/image';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

interface ArticleGeneratorPreviewProps {
  topic?: string;
  content?: string[];
  imageUrl?: string;
  isLoading: boolean;
}

export const ArticleGeneratorPreview: FC<ArticleGeneratorPreviewProps> = ({
  topic,
  content,
  imageUrl,
  isLoading,
}) => {
  if (!topic) {
    return (
      <Card className="flex h-full items-center justify-center">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Выберите тему для генерации статьи
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-auto">
      <CardHeader>
        <CardTitle>Превью статьи</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <div className="article-preview">
            <h1 className="mb-4 text-2xl font-bold">{topic}</h1>

            {imageUrl && (
              <div className="my-4 flex justify-center">
                <Image
                  src={imageUrl || '/placeholder.svg'}
                  alt={`Изображение для статьи: ${topic}`}
                  width={0}
                  height={0}
                  layout="responsive"
                  className="max-h-64 rounded-md object-cover"
                />
              </div>
            )}

            {content ? (
              <div className="prose prose-sm max-w-none">
                {content.map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground py-4 text-center">
                {'Нажмите «Генерировать статью», чтобы создать контент.'}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
