import { useCallback } from "react";

export const SCROLL_DIRECTION = {
  VERTICAL: "vertical",
  HORIZONTAL: "horizontal",
};

export function useScrollTo(ref) {
  const scrollToEdge = useCallback(
    ({
      direction = SCROLL_DIRECTION.VERTICAL,
      scrollToBottom = true,
      smooth = true,
    } = {}) => {
      const element = ref.current;

      if (!element) {
        console.warn("useScrollTo: Reference element is not available.");
        return;
      }

      const scrollOptions = {
        behavior: smooth ? "smooth" : "auto",
      };

      if (direction === SCROLL_DIRECTION.VERTICAL) {
        scrollOptions.top = scrollToBottom ? element.scrollHeight : 0;
      } else if (direction === SCROLL_DIRECTION.HORIZONTAL) {
        scrollOptions.left = element.scrollWidth;
      } else {
        console.error(
          "useScrollTo: Invalid direction provided. Use SCROLL_DIRECTION.VERTICAL or SCROLL_DIRECTION.HORIZONTAL."
        );

        return;
      }

      element.scrollTo(scrollOptions);
    },
    [ref]
  );

  return scrollToEdge;
}
