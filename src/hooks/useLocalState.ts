import { useEffect, useRef, useState } from "react";

export function useLocalState<T>(
  key: string,
  initial: () => T,
  options?: {
    debounceMs?: number;
    migrate?: (raw: unknown) => T;
  },
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const debounceMs = options?.debounceMs ?? 200;
  const migrate = options?.migrate;

  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return initial();
      const parsed = JSON.parse(raw) as unknown;
      return migrate ? migrate(parsed) : (parsed as T);
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
