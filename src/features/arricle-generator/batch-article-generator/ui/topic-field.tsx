import { FC, useState } from 'react';
import { Plus } from 'lucide-react';

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

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

  const handleClick = () => {
    const valueArray = value.split(';').map((item) => item.trim());
    onClickAdd(valueArray);
    setValue('');
  };

  return (
    <div className={cn(className, 'flex space-x-2')}>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ведите тему"
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        disabled={disabled}
      />
      <Button onClick={handleClick} size="icon" disabled={!value}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
