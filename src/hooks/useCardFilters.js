import { useSelector, useDispatch } from "react-redux";
import { useCallback, useMemo } from "react";
import { setFilters, clearAllFilters } from "../store/actions/board-actions";
import { debounce } from "../services/util-service";

export const useCardFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector(state => state.boards.filterBy);

  const updateFilter = useCallback(
    (filterType, value) => {
      dispatch(setFilters({ [filterType]: value }));
    },
    [dispatch]
  );

  const updateFilterDebounced = useMemo(
    () =>
      debounce((filterType, value) => {
        dispatch(setFilters({ [filterType]: value }));
      }, 300),
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
    updateFilterDebounced,
    removeFilter,
    clearAllFilters: handleClearAllFilters,
  };
};
