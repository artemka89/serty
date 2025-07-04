'use client';

import { useCallback, useState } from 'react';

import { useIntervalMutation } from '@/shared/api/use-Interval-mutation';
import { saveArticle } from '@/shared/lib/actions';

import { getArticlePrompt, getImagePrompt } from '../../model/promts';
import { useGetArticle } from '../../model/use-get-article';
import { useGetImage } from '../../model/use-get-image';

import { ProcessedArticles, Topic } from './types';

interface UseGetBatchArticleProps {
  topics: Topic[];
  interval: number;
}

export const useGetBatchArticle = ({
  topics,
  interval,
}: UseGetBatchArticleProps) => {
  const [processedArticles, setProcessedArticles] = useState<ProcessedArticles>(
    {},
  );

  const articleQuery = useGetArticle();
  const imageQuery = useGetImage();

  const updateArticleState = useCallback(
    (id: string, updates: Partial<ProcessedArticles[string]>) => {
      setProcessedArticles((prev) => ({
        ...prev,
        [id]: { ...prev[id], ...updates },
      }));
    },
    [],
  );

  const mutate = async (item: Topic, signal?: AbortSignal) => {
    updateArticleState(item.id, { status: 'text_in_progress' });

    const { data: article } = await articleQuery.mutate(
      { prompt: getArticlePrompt(item.value) },
      signal,
    );

    if (!article) return;

    const paragraphs = article.data.split('\n\n').filter(Boolean);
    updateArticleState(item.id, { status: 'image_in_progress' });

    const { data: image } = await imageQuery.mutate(
      {
        prompt: getImagePrompt(paragraphs[0]),
        size: '256x256',
      },
      signal,
    );

    if (!image) return;

    return {
      id: item.id,
      topic: paragraphs[0],
      paragraphs: paragraphs.slice(1),
      image,
    };
  };

  const articleIntervalQuery = useIntervalMutation(topics, mutate, {
    interval: Number(interval) * 1000,

    onSuccess: async (data, item) => {
      if (!data) return;

      updateArticleState(data.id, { status: 'completed' });

      await saveArticle({
        topic: data.topic,
        content: data.paragraphs,
        imageUrl: data.image?.url,
      });

      updateArticleState(item.id, { isSaved: true });
    },

    onError: (_error, item) => {
      updateArticleState(item.id, { status: 'error' });
    },
    onAbort: (items) => {
      setProcessedArticles((prev) => {
        const updated = { ...prev };
        items.forEach((item) => {
          updated[item.id] = {
            topic: item.value,
            status: 'canceled',
            isSaved: false,
          };
        });
        return updated;
      });
    },
  });

  const startGenerate = useCallback(() => {
    setProcessedArticles((prev) => {
      const updated = { ...prev };
      topics.forEach((item) => {
        updated[item.id] = {
          topic: item.value,
          status: 'pending',
          isSaved: false,
        };
      });
      return updated;
    });

    articleIntervalQuery.start();
  }, [articleIntervalQuery, topics]);

  return {
    data: processedArticles,
    isLoading: articleIntervalQuery.isLoading,
    startFetching: startGenerate,
    stopFetching: articleIntervalQuery.stop,
  };
};
