'use client';

import { useCallback, useState } from 'react';

type RequestInit<T> = {
  headers?: Record<string, string>;
  body?: T;
};

type MutationType<T, K> = {
  mutate: (body: void | T) => Promise<{ data?: K }>;
  error: string | null;
  isLoading: boolean;
  data?: K;
};

export function useMutation<Req, Res>(
  url: string,
  options?: RequestInit<Req>,
): MutationType<Req, Res> {
  const [data, setData] = useState<Res | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(
    async (body: Req | void): Promise<{ data?: Res; error?: string }> => {
      setData(undefined);
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          ...options,
          body: JSON.stringify({ ...options?.body, ...body }),
          method: 'POST',
          cache: 'no-cache',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        let responseData;
        if (contentType === 'application/zip') {
          responseData = await response.blob();
        } else {
          responseData = await response.json();
        }

        setData(responseData);
        return { data: responseData };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
        return { error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [url, options],
  );

  return { mutate, data, error, isLoading };
}
