import { useEffect, useRef } from "react";

export function useDragToScroll(ref, options = {}) {
  const { sensitivity = 1, enabled = true } = options;

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  const hasMoved = useRef(false);
  const DRAG_THRESHOLD = 5; // px

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;

    const onMouseDown = e => {
      if (e.button !== 0) return;

      const target = e.target;
      if (
        target.closest(
          "input, textarea, select, button, [role='button'], [draggable='true']"
        )
      ) {
        return;
      }

      hasMoved.current = false;
      isDragging.current = false;

      startX.current = e.clientX;
      startScroll.current = el.scrollLeft;
    };

    const onMouseMove = e => {
      if (startX.current === null) return;

      const dx = e.clientX - startX.current;

      if (!isDragging.current) {
        if (Math.abs(dx) > DRAG_THRESHOLD) {
          hasMoved.current = true;
          isDragging.current = true;
        } else {
          return;
        }
      }

      el.scrollLeft = startScroll.current - dx * sensitivity;
      e.preventDefault();
    };

    const onMouseUp = () => {
      startX.current = null;
      isDragging.current = false;
    };

    el.addEventListener("mousedown", onMouseDown, { passive: false });
    document.addEventListener("mousemove", onMouseMove, { passive: false });
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [ref, sensitivity, enabled]);
}
