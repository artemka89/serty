'use client';

import React, { type FC, useState } from 'react';
import { Archive, FileText, ImageIcon, Save } from 'lucide-react';

import { saveArticle } from '@/app/actions';
import { useToast } from '@/shared/hooks/use-toast';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';

import { donloadArticleZip } from '../model/donloadArticleZip';
import { getArticlePrompt, getImagePrompt } from '../model/promts';
import { useGetArticle } from '../model/use-get-article';
import { useGetImage } from '../model/use-get-image';

import { ArticleGeneratorCard } from './article-generator-card';
import { ArticleGeneratorPreview } from './article-generator-preview';

interface ArticleGeneratorSectionProps {
  className?: string;
}

export const ArticleGeneratorSection: FC<ArticleGeneratorSectionProps> = ({
  className,
}) => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [isSavingHtml, setIsSavingHtml] = useState(false);
  const [isSavingZip, setIsSavingZip] = useState(false);

  const articleQuery = useGetArticle();
  const imageQuery = useGetImage();

  const { toast } = useToast();

  const handleGenerateArticle = () => {
    if (!selectedTopic) return;
    articleQuery.mutate({ prompt: getArticlePrompt(selectedTopic) });
  };

  const handleGenerateImage = () => {
    if (!articleQuery.data) return;
    imageQuery.mutate({
      prompt: getImagePrompt(articleQuery.data?.[0]),
      size: '256x256',
    });
  };

  const handleSaveArticle = async () => {
    if (!selectedTopic || !articleQuery.data) return;
    setIsSavingHtml(true);
    await saveArticle({
      topic: articleQuery.data[0],
      content: articleQuery.data,
      imageUrl: imageQuery.data,
    });
    toast({
      title: `Статья "${articleQuery.data[0]}" сохранена`,
    });
    setIsSavingHtml(false);
  };

  const handleDownloadAsZip = async () => {
    if (!articleQuery.data) return;
    setIsSavingZip(true);
    await donloadArticleZip({
      data: articleQuery.data,
      filename: articleQuery.data[0],
      imageUrl: imageQuery.data || undefined,
    })
      .then(() => {
        toast({
          title: 'Скачивание завершено',
          description: `Статья "${selectedTopic}" скачена.`,
        });
      })
      .catch(() => {
        toast({
          title: 'Ошибка скачивания',
          description: `Статья "${selectedTopic}" не скачена.`,
          variant: 'destructive',
        });
      });
    setIsSavingZip(false);
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
              Гнерация изображения с DALL-E
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
              disabled={!articleQuery.data || isSavingZip}
              variant="outline"
              isLoading={isSavingZip}
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
