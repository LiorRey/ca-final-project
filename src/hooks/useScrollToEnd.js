import { useRef, useCallback } from "react";

export function useScrollToEnd() {
  const ref = useRef(null);

  const scrollToEnd = useCallback(
    ({ horizontal = false, smooth = true } = {}) => {
      const el = ref.current;
      if (!el) return;

      if (horizontal) {
        el.scrollTo({
          left: el.scrollWidth,
          behavior: smooth ? "smooth" : "auto",
        });
      } else {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: smooth ? "smooth" : "auto",
        });
      }
    },
    []
  );

  return [ref, scrollToEnd];
}
