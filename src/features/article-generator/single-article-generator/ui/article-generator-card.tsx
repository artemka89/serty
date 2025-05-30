import React, { type FC } from 'react';

import { TOPICS } from '@/features/article-generator/model/constants';
import { cn } from '@/shared/lib/cn';
import {
  Card,
  CardContent,
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

interface ArticleGeneratorCardProps {
  selectedTopic: string;
  setTopic: (topic: string) => void;
  generateActions?: React.ReactNode;
  downloadActions?: React.ReactNode;
  className?: string;
}

export const ArticleGeneratorCard: FC<ArticleGeneratorCardProps> = ({
  selectedTopic,
  setTopic,
  generateActions,
  downloadActions,
  className,
}) => {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Темы</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex space-x-2">
          <Select onValueChange={setTopic} value={selectedTopic}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберете тему статьи" />
            </SelectTrigger>
            <SelectContent>
              {TOPICS.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        {generateActions}
        <div className="flex w-full items-center gap-2">{downloadActions}</div>
      </CardFooter>
    </Card>
  );
};
