import { useEffect, useRef, useState } from "react";

/**
 * Keeps content mounted briefly after `open` becomes false so exit transitions can finish.
 * `show` drives visible state (e.g. opacity / transform); set to true one frame after mount when opening.
 */
export function usePresence(open: boolean, durationMs = 250) {
  const [mounted, setMounted] = useState(open);
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setShow(true));
      });
      return () => cancelAnimationFrame(id);
    }

    setShow(false);
    timeoutRef.current = setTimeout(() => {
      setMounted(false);
      timeoutRef.current = null;
    }, durationMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [open, durationMs]);

  return { mounted, show };
}
