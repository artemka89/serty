'use client';

import { FC, useState } from 'react';
import { Play, Square } from 'lucide-react';

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

import { TIMES } from '../model/constants';
import { Topic } from '../model/types';
import { useGetBatchArticle } from '../model/use-get-batch-article';

import { BatchArticlesList } from './batch-article-list';
import { ButchArticleTopics } from './batch-article-topics';
import { TopicField } from './topic-field';

interface BatchArticlesGeneratorProps {
  className?: string;
}

export const BatchArticlesGenerator: FC<BatchArticlesGeneratorProps> = ({
  className,
}) => {
  const [topics, setTopics] = useState<Topic[]>([]);

  const [interval, setInterval] = useState(300);

  const { data, isLoading, startFetching, stopFetching } = useGetBatchArticle({
    topics,
    interval,
  });

  const addTopic = (value: string[]) => {
    const newTopics = value.map((item, index) => ({
      id: `${Date.now().toString()}-${index}`,
      value: item,
    }));
    setTopics((prev) => [...prev, ...newTopics]);
  };

  const removeTopic = (id: string) => {
    setTopics((prev) => prev.filter((topic) => topic.id !== id));
  };

  return (
    <section
      className={cn(
        className,
        'grid grid-cols-1 items-start gap-8 md:grid-cols-2',
      )}
    >
      <Card>
        <CardHeader>
          <CardTitle>Настройка пакетной генерации</CardTitle>
          <CardDescription>
            {
              'Добавьте одну или несколько тем, разделяя " ; " и выберите интервал генерации'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TopicField onClickAdd={addTopic} disabled={isLoading} />

          <div className="w-full space-y-2">
            <label className="text-sm font-medium">Интервал генерации</label>
            <Select
              value={interval.toString()}
              onValueChange={(value) => setInterval(Number(value))}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMES.map((time) => (
                  <SelectItem key={time.value} value={time.value}>
                    {time.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ButchArticleTopics topics={topics} removeTopic={removeTopic} />
        </CardContent>
        <CardFooter>
          <div className="flex w-full gap-2.5">
            <Button
              className="grow"
              onClick={startFetching}
              disabled={!topics.length || isLoading}
              isLoading={isLoading}
            >
              <Play className="w-4" />
              Начать генерацию
            </Button>
            <Button
              variant="destructive"
              onClick={stopFetching}
              disabled={!isLoading}
            >
              <Square className="w-4" />
              Стоп
            </Button>
          </div>
        </CardFooter>
      </Card>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Статус генерации</CardTitle>
          <CardDescription>Отслеживайте ход каждой статьи</CardDescription>
        </CardHeader>
        <CardContent>
          <BatchArticlesList
            items={Object.entries(data).map(([id, item]) => ({ ...item, id }))}
          />
        </CardContent>
      </Card>
    </section>
  );
};
