import { ButchArticlesStatus } from './types';

export const TIMES = [
  { label: '15 секунд', value: '15' },
  { label: '2 минуты', value: '120' },
  { label: '5 минут', value: '300' },
  { label: '10 минут', value: '600' },
  { label: '15 минут', value: '900' },
];
export const STATUSES: Record<ButchArticlesStatus, string> = {
  ['pending']: 'Ожидает',
  ['text_in_progress']: 'Генерация текста',
  ['image_in_progress']: 'Генерация изображения',
  ['completed']: 'Завершен',
  ['error']: 'Ошибка',
  ['canceled']: 'Отменен',
};
