import { useMutation } from '@/shared/api/useMutation';

type RequestGenerateArticle = {
  prompt: string;
  size: '256x256' | '512x512' | '1024x1024';
};

type ResponseGenerateImage = {
  url: string;
};

export const useGetImage = () => {
  const { mutate, data, error, isLoading } = useMutation<
    RequestGenerateArticle,
    ResponseGenerateImage
  >('api/generate-image');

  return { mutate, data: data?.url, error, isLoading };
};
