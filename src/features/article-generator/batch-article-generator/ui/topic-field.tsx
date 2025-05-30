import { FC, useState } from 'react';
import { Plus } from 'lucide-react';

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';

interface TopicFieldProps {
  onClickAdd: (value: string[]) => void;
  disabled?: boolean;
  className?: string;
}

export const TopicField: FC<TopicFieldProps> = ({
  onClickAdd,
  disabled,
  className,
}) => {
  const [value, setValue] = useState('');

  const onSentValue = () => {
    if (!value.trim()) return;
    const valueArray = value.split(';').map((item) => item.trim());
    onClickAdd(valueArray);
    setValue('');
  };

  const handleClick = (event?: React.KeyboardEvent) => {
    if (event && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSentValue();
    }
  };

  return (
    <div className={cn(className, 'flex space-x-2')}>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ведите тему"
        onKeyDown={handleClick}
        disabled={disabled}
      />
      <Button onClick={onSentValue} size="icon" disabled={!value}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
