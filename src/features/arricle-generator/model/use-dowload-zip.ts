import { useMutation } from '@/shared/api/useMutation';

type RequestDowloadZip = {
  content: string[];
  topic: string;
  imageUrl?: string;
};

export const useDowloadZip = () => {
  const { mutate, data, error, isLoading } = useMutation<
    RequestDowloadZip,
    Blob
  >(`api/download-zip`, {
    headers: { 'Content-Type': 'application/json' },
  });

  return { mutate, data, error, isLoading };
};
