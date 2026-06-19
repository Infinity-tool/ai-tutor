import { useState, useCallback } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [stored, setStored] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const toStore = value instanceof Function ? value(stored) : value;
        setStored(toStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(toStore));
        }
      } catch (error) {
        console.error(`[useLocalStorage] Failed to set "${key}":`, error);
      }
    },
    [key, stored]
  );

  const remove = useCallback(() => {
    setStored(initialValue);
    if (typeof window !== "undefined") window.localStorage.removeItem(key);
  }, [key, initialValue]);

  return [stored, setValue, remove] as const;
}
