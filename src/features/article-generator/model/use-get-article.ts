import { useMutation } from '@/shared/api/use-mutation';

type ResponseGenerateArticle = {
  data: string;
};

export const useGetArticle = () => {
  const { mutate, data, error, isLoading } = useMutation<
    { prompt: string },
    ResponseGenerateArticle
  >(`api/generate-text`);

  const articleParagraphs = data?.data.split('\n\n').filter(Boolean);

  return { mutate, data: articleParagraphs, error, isLoading };
};
