import { useMutation } from '@/shared/api/use-mutation';

type RequestDownloadZip = {
  content: string[];
  topic: string;
  imageUrl?: string;
};

export const useDownloadZip = () => {
  const { mutate, data, error, isLoading } = useMutation<
    RequestDownloadZip,
    Blob
  >(`api/download-zip`, {
    headers: { 'Content-Type': 'application/json' },
  });

  return { mutate, data, error, isLoading };
};
