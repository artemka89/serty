export type ButchArticlesStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'error'
  | 'canceled';

export type ProcessedArticles = Record<
  string,
  { topic: string; status: ButchArticlesStatus; isSaved?: boolean }
>;

export type Topic = {
  id: string;
  value: string;
};
