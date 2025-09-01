import { useState, useCallback } from 'react';
import { CacheEntry } from '@/types/blog';

const CACHE_PREFIX = 'chyrp_cache_';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export function useCache() {
  const [cacheStats, setCacheStats] = useState({
    hits: 0,
    misses: 0,
    size: 0
  });

  const get = useCallback(<T>(key: string): T | null => {
    try {
      const cached = localStorage.getItem(CACHE_PREFIX + key);
      if (!cached) {
        setCacheStats(prev => ({ ...prev, misses: prev.misses + 1 }));
        return null;
      }

      const entry: CacheEntry = JSON.parse(cached);
      const now = Date.now();
      
      if (now > entry.timestamp + entry.ttl) {
        localStorage.removeItem(CACHE_PREFIX + key);
        setCacheStats(prev => ({ ...prev, misses: prev.misses + 1 }));
        return null;
      }

      setCacheStats(prev => ({ ...prev, hits: prev.hits + 1 }));
      return entry.data;
    } catch {
      return null;
    }
  }, []);

  const set = useCallback((key: string, data: any, ttl = DEFAULT_TTL) => {
    try {
      const entry: CacheEntry = {
        key,
        data,
        timestamp: Date.now(),
        ttl
      };
      
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
      setCacheStats(prev => ({ ...prev, size: prev.size + 1 }));
    } catch (error) {
      console.warn('Cache set failed:', error);
    }
  }, []);

  const clear = useCallback(() => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    setCacheStats({ hits: 0, misses: 0, size: 0 });
  }, []);

  const remove = useCallback((key: string) => {
    localStorage.removeItem(CACHE_PREFIX + key);
    setCacheStats(prev => ({ ...prev, size: Math.max(0, prev.size - 1) }));
  }, []);

  return {
    get,
    set,
    clear,
    remove,
    stats: cacheStats
  };
}