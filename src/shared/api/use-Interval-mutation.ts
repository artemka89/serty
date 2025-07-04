import { useEffect, useRef, useState } from 'react';

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

  const sendRequest = async () => {
    if (currentIndexRef.current >= bodyItems.length) {
      return;
    }

    setIsLoading(true);

    isActiveProcessRef.current = true;
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

    if (!isActiveProcessRef.current) return;

    if (currentIndexRef.current < bodyItems.length) {
      timerRef.current = setTimeout(sendRequest, interval);
    } else {
      clear();
    }
  };

  const start = () => {
    if (isActiveProcessRef.current) return;
    clear();
    sendRequest();
  };

  const stop = () => {
    const items = bodyItems.slice(currentIndexRef.current);
    onAbort?.(items);
    clear();
  };

  function clear() {
    setIsLoading(false);
    clearTimeout(timerRef.current);
    timerRef.current = undefined;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    currentIndexRef.current = 0;
    isActiveProcessRef.current = false;
  }

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return { start, stop, isLoading };
};
