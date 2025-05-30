import { FC } from 'react';

import { cn } from '@/shared/lib/cn';
import { Badge } from '@/shared/ui/badge';

import { STATUSES } from '../model/constants';
import { ButchArticlesStatus } from '../model/types';

type BatchArticlesItem = {
  id: string;
  topic: string;
  status: ButchArticlesStatus;
  isSaved?: boolean;
};

interface BatchArticlesListProps {
  items: BatchArticlesItem[];
  className?: string;
}

export const BatchArticlesList: FC<BatchArticlesListProps> = ({
  items,
  className,
}) => {
  return (
    <div className={cn(className, 'max-h-96 space-y-3 overflow-y-auto')}>
      {items.length === 0 ? (
        <p className="text-muted-foreground py-4 text-center text-sm">
          Нет статей в очереди. Добавьте темы, чтобы начать генерацию.
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {items.map((item) => {
            return (
              <li
                key={item.id}
                className="flex items-center justify-between space-y-2 rounded-md border bg-gray-100 p-2"
              >
                <div className="">
                  <h3 className="font-semibold first-letter:uppercase">
                    {item.topic}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {STATUSES[item.status]}
                  </p>
                </div>
                {item.isSaved && (
                  <Badge className="bg-green-600 text-white">Сохранен</Badge>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
