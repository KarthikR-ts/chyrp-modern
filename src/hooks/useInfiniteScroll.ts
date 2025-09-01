import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useInfiniteScroll(
  fetchMore: () => Promise<void>,
  hasMore: boolean,
  options: UseInfiniteScrollOptions = {}
) {
  const [isFetching, setIsFetching] = useState(false);
  const [sentinelRef, setSentinelRef] = useState<HTMLDivElement | null>(null);

  const { threshold = 1.0, rootMargin = '20px' } = options;

  useEffect(() => {
    if (!sentinelRef || !hasMore) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !isFetching && hasMore) {
          setIsFetching(true);
          try {
            await fetchMore();
          } catch (error) {
            console.error('Error fetching more data:', error);
          } finally {
            setIsFetching(false);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(sentinelRef);

    return () => {
      observer.disconnect();
    };
  }, [sentinelRef, fetchMore, hasMore, isFetching, threshold, rootMargin]);

  const setSentinel = useCallback((node: HTMLDivElement | null) => {
    setSentinelRef(node);
  }, []);

  return {
    isFetching,
    setSentinel
  };
}