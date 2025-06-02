"use client";

import { useRef } from "react";

export interface DebounceFn {
  run: (fn: () => void) => void;
  cancel: () => void;
}

export function useDebounceFn(delay: number = 300): DebounceFn {
  const timer = useRef<number>(undefined);

  const run = (fn: () => void) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = window.setTimeout(() => {
      fn();
    }, delay);
  };

  const cancel = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
  };

  return {
    run,
    cancel,
  };
}
