'use client';

import React, { type FC, useState } from 'react';
import { Archive, FileText, ImageIcon, Save } from 'lucide-react';

import { saveArticle } from '@/app/actions';
import { useToast } from '@/shared/hooks/use-toast';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';

import { downloadFile } from '../../model/download-file';
import { getArticlePrompt, getImagePrompt } from '../../model/promts';
import { useDownloadZip } from '../../model/use-download-zip';
import { useGetArticle } from '../../model/use-get-article';
import { useGetImage } from '../../model/use-get-image';

import { ArticleGeneratorCard } from './article-generator-card';
import { ArticleGeneratorPreview } from './article-generator-preview';

interface SingleArticleGeneratorProps {
  className?: string;
}

export const SingleArticleGenerator: FC<SingleArticleGeneratorProps> = ({
  className,
}) => {
  const { toast } = useToast();

  const [selectedTopic, setSelectedTopic] = useState('');
  const [isSavingHtml, setIsSavingHtml] = useState(false);

  const articleQuery = useGetArticle();
  const imageQuery = useGetImage();
  const downloadZipQuery = useDownloadZip();

  const handleGenerateArticle = () => {
    if (!selectedTopic) return;
    articleQuery.mutate({ prompt: getArticlePrompt(selectedTopic) });
  };

  const handleGenerateImage = () => {
    if (!articleQuery.data) return;
    imageQuery.mutate({
      prompt: getImagePrompt(articleQuery.data[0]),
      size: '256x256',
    });
  };

  const handleSaveArticle = async () => {
    if (!selectedTopic || !articleQuery.data) return;
    setIsSavingHtml(true);
    await saveArticle({
      topic: articleQuery.data[0],
      content: articleQuery.data.slice(1),
      imageUrl: imageQuery.data,
    });
    toast({
      title: `Статья "${articleQuery.data[0]}" сохранена`,
    });
    setIsSavingHtml(false);
  };

  const handleDownloadAsZip = async () => {
    if (!articleQuery.data) return;
    const { data } = await downloadZipQuery.mutate({
      topic: articleQuery.data[0],
      content: articleQuery.data,
      imageUrl: imageQuery.data,
    });

    if (!data) return;

    downloadFile({
      blob: data,
      filename: articleQuery.data[0],
      format: 'zip',
    })
      .then(() => {
        toast({
          title: 'Скачивание завершено',
          description: `Статья "${articleQuery.data?.[0]}" скачена.`,
        });
      })
      .catch(() => {
        toast({
          title: 'Ошибка скачивания',
          description: `Статья "${articleQuery.data?.[0]}" не скачена.`,
          variant: 'destructive',
        });
      });
  };

  return (
    <section
      className={cn(
        className,
        'grid grid-cols-1 items-start gap-8 md:grid-cols-2',
      )}
    >
      <ArticleGeneratorCard
        selectedTopic={selectedTopic}
        setTopic={setSelectedTopic}
        generateActions={
          <>
            <Button
              onClick={handleGenerateArticle}
              icon={<FileText />}
              disabled={!selectedTopic || articleQuery.isLoading}
              isLoading={articleQuery.isLoading}
              className="w-full"
            >
              Сгенерировать статью с Gemini
            </Button>
            <Button
              onClick={handleGenerateImage}
              icon={<ImageIcon />}
              disabled={!articleQuery.data || imageQuery.isLoading}
              isLoading={imageQuery.isLoading}
              className="w-full"
            >
              Генерация изображения с DALL-E
            </Button>
          </>
        }
        downloadActions={
          <>
            <Button
              onClick={handleSaveArticle}
              icon={<Save />}
              disabled={!articleQuery.data || isSavingHtml}
              isLoading={isSavingHtml}
              variant="outline"
              className="grow"
            >
              Сохранить HTML
            </Button>
            <Button
              onClick={handleDownloadAsZip}
              icon={<Archive />}
              disabled={!articleQuery.data || downloadZipQuery.isLoading}
              variant="outline"
              isLoading={downloadZipQuery.isLoading}
              className="grow"
            >
              Скачать ZIP
            </Button>
          </>
        }
      />
      <ArticleGeneratorPreview
        topic={articleQuery.data?.[0] || selectedTopic}
        content={articleQuery.data?.slice(1)}
        imageUrl={imageQuery.data}
        isLoading={articleQuery.isLoading || imageQuery.isLoading}
      />
    </section>
  );
};
