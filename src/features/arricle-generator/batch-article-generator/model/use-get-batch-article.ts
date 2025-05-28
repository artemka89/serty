'use client';

import { useCallback, useMemo, useState } from 'react';

import { saveArticle } from '@/app/actions';
import { useIntervalMutation } from '@/shared/api/useIntervalMutation';

import { getArticlePrompt } from '../../model/promts';
import { useGetArticle } from '../../model/use-get-article';

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
  const updateArticleState = useCallback(
    (id: string, updates: Partial<ProcessedArticles[string]>) => {
      setProcessedArticles((prev) => ({
        ...prev,
        [id]: { ...prev[id], ...updates },
      }));
    },
    [],
  );

  const articleIntervalQuery = useIntervalMutation(
    topics,
    (item, signal) =>
      articleQuery.mutate({ prompt: getArticlePrompt(item.value) }, signal),
    {
      interval: Number(interval) * 1000,
      onMutate: async (item) => {
        updateArticleState(item.id, { status: 'in_progress' });
      },
      onSuccess: async ({ data }, item) => {
        const articleParagraphs = data?.data?.split('\n\n').filter(Boolean);
        if (!articleParagraphs) return;

        updateArticleState(item.id, { status: 'completed' });

        await saveArticle({
          topic: articleParagraphs[0],
          content: articleParagraphs,
          imageUrl: undefined,
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
    },
  );

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
