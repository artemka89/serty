import { useCallback, useEffect, useRef, useState } from 'react';

interface UseIntervalMutationProps<T, K> {
  interval?: number;
  onMutate?: (item: T) => Promise<void>;
  onSuccess?: (data: K, item: T) => void;
  onError?: (error: string, item: T) => void;
  onAbort?: (items: T[]) => void;
}

export const useIntervalMutation = <T, K>(
  bodyItems: T[],
  mutate: (item: T, signal?: AbortSignal) => Promise<K>,
  options: UseIntervalMutationProps<T, K>,
) => {
  const [isLoading, setIsLoading] = useState(false);

  const { interval = 2000, onMutate, onSuccess, onError, onAbort } = options;

  const timerRef = useRef<NodeJS.Timeout>(undefined);
  const currentIndexRef = useRef(0);
  const isActiveProcessRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = undefined;
    isActiveProcessRef.current = false;
    currentIndexRef.current = 0;
    setIsLoading(false);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();

      const items = bodyItems.slice(currentIndexRef.current);
      onAbort?.(items);
    }
  }, [bodyItems, onAbort]);

  const sendRequest = async () => {
    if (currentIndexRef.current >= bodyItems.length) {
      return;
    }

    setIsLoading(true);

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    const item = bodyItems[currentIndexRef.current];

    await onMutate?.(item);

    await mutate(item, abortControllerRef.current.signal)
      .then((data) => {
        onSuccess?.(data, item);
      })
      .catch((error) => {
        onError?.(error, item);
      })
      .finally(() => {
        if (abortControllerRef.current?.signal.aborted) {
          abortControllerRef.current = null;
        }
      });

    currentIndexRef.current += 1;

    if (currentIndexRef.current < bodyItems.length) {
      timerRef.current = setTimeout(sendRequest, interval);
    }

    if (currentIndexRef.current === bodyItems.length) {
      stop();
    }
  };

  const start = () => {
    if (isActiveProcessRef.current) return;
    timerRef.current = undefined;
    currentIndexRef.current = 0;
    isActiveProcessRef.current = true;
    setIsLoading(false);
    sendRequest();
  };

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { start, stop, isLoading };
};
