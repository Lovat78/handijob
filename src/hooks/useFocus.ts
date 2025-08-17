// src/hooks/useFocus.ts
import { useRef, useEffect } from 'react';

export function useFocus<T extends HTMLElement>(): [React.RefObject<T>, () => void] {
  const ref = useRef<T>(null);

  const setFocus = () => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  return [ref, setFocus];
}