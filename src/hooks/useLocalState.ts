import { useEffect, useRef, useState } from "react";

export function useLocalState<T>(
  key: string,
  initial: () => T,
  debounceMs = 200,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return initial();
      return JSON.parse(raw) as T;
    } catch {
      return initial();
    }
  });

  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
    }
    timer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // storage full or unavailable — nothing useful to do
      }
    }, debounceMs);

    return () => {
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
      }
    };
  }, [key, value, debounceMs]);

  return [value, setValue];
}
