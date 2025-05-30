import { FC } from 'react';
import { Trash2 } from 'lucide-react';

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';

interface ButchArticleTopicsProps {
  topics: { id: string; value: string }[];
  removeTopic: (id: string) => void;
  className?: string;
}

export const ButchArticleTopics: FC<ButchArticleTopicsProps> = ({
  topics,
  removeTopic,
  className,
}) => {
  return (
    <ul className={cn(className, 'space-y-2')}>
      {topics.length === 0 ? (
        <li>
          <p className="text-muted-foreground min-h-[52px] text-center text-sm">
            Пока не добавлено ни одной темы. Добавьте несколько тем, чтобы
            начать.
          </p>
        </li>
      ) : (
        topics.map((topic) => (
          <li
            key={topic.id}
            className="flex items-center justify-between rounded-md bg-gray-100 p-2"
          >
            <span>{topic.value}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeTopic(topic.id)}
            >
              <Trash2 className="text-destructive h-4 w-4" />
            </Button>
          </li>
        ))
      )}
    </ul>
  );
};
