'use client';

import { useState } from 'react';

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
  const articleIntervalQuery = useIntervalMutation(
    topics,
    (item, signal) =>
      articleQuery.mutate({ prompt: getArticlePrompt(item.value) }, signal),
    {
      interval: Number(interval) * 1000,
      onMutate: async (item) => {
        setProcessedArticles((prev) => ({
          ...prev,
          [item.id]: {
            topic: item.value,
            status: 'in_progress',
            isSaved: false,
          },
        }));
      },
      onSuccess: async ({ data }, item) => {
        const articleParagraphs = data?.data?.split('\n\n').filter(Boolean);
        if (!articleParagraphs) return;
        setProcessedArticles((prev) => ({
          ...prev,
          [item.id]: {
            topic: item.value,
            status: 'completed',
            isSaved: false,
          },
        }));

        await saveArticle({
          topic: articleParagraphs[0],
          content: articleParagraphs,
          imageUrl: undefined,
        });

        setProcessedArticles((prev) => ({
          ...prev,
          [item.id]: {
            topic: item.value,
            status: 'completed',
            isSaved: true,
          },
        }));
      },

      onError: (_error, item) => {
        setProcessedArticles((prev) => ({
          ...prev,
          [item.id]: {
            topic: item.value,
            status: 'error',
            isSaved: false,
          },
        }));
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

  const startGenerate = () => {
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
  };

  return {
    data: processedArticles,
    isLoading: articleIntervalQuery.isLoading,
    startFetching: startGenerate,
    stopFetching: articleIntervalQuery.stop,
  };
};
