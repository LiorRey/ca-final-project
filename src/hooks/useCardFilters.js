import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { setFilters, clearAllFilters } from "../store/actions/board-actions";

export const useCardFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector(state => state.boards.filterBy);

  const updateFilter = useCallback(
    (filterType, value) => {
      dispatch(setFilters({ [filterType]: value }));
    },
    [dispatch]
  );

  const removeFilter = useCallback(
    (type, value) => {
      if (type === "title") {
        dispatch(setFilters({ title: "" }));
      }
    },
    [dispatch]
  );

  const handleClearAllFilters = useCallback(() => {
    dispatch(clearAllFilters());
  }, [dispatch]);

  return {
    filters,
    updateFilter,
    removeFilter,
    clearAllFilters: handleClearAllFilters,
  };
};
