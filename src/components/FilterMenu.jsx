import { useState, useRef, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FilterList from "@mui/icons-material/FilterList";
import { useCardFilters } from "../hooks/useCardFilters";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Autocomplete from "@mui/material/Autocomplete";
import {
  CURRENT_USER_ID_PLACEHOLDER,
  getMembersFilterOptions,
} from "../services/filter-service";

export function FilterMenu() {
  const members = useSelector(state => state.boards.board.members);
  const [isOpen, setIsOpen] = useState(false);
  const [localTitle, setLocalTitle] = useState("");
  const anchorRef = useRef(null);
  const { filters, updateFilterDebounced, updateFilter, clearAllFilters } =
    useCardFilters();
  const memberOptions = useMemo(
    () => getMembersFilterOptions(members),
    [members]
  );

  useEffect(() => {
    setLocalTitle(filters.title || "");
  }, [filters.title]);

  function handleClearFilters() {
    setLocalTitle("");
    clearAllFilters();
  }

  function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  function handleTitleChange(event) {
    const value = event.target.value;
    setLocalTitle(value);
    updateFilterDebounced("title", value);
  }

  function handleMembersChange(event, checked) {
    const checkboxName = event.target.name;
    let newMembers;
    if (checkboxName === "assignedToMe") {
      newMembers = filters.members ? [...filters.members] : [];
      if (checked) {
        newMembers = [...newMembers, CURRENT_USER_ID_PLACEHOLDER];
      } else {
        newMembers = newMembers.filter(
          id => id !== CURRENT_USER_ID_PLACEHOLDER
        );
      }
    } else if (checkboxName === "selectAll") {
      if (checked) {
        newMembers = members
          .filter(m => m._id !== CURRENT_USER_ID_PLACEHOLDER)
          .map(m => m._id);
        if (filters.members?.includes(CURRENT_USER_ID_PLACEHOLDER)) {
          newMembers = [CURRENT_USER_ID_PLACEHOLDER, ...newMembers];
        }
      } else {
        newMembers = [];
      }
    }
    updateFilter("members", newMembers);
  }

  function isSomeMembersSelected() {
    const filtered = members.filter(m => m._id !== CURRENT_USER_ID_PLACEHOLDER);
    const selectedCount = filtered.filter(m =>
      filters.members?.includes(m._id)
    ).length;
    return selectedCount > 0 && selectedCount < filtered.length;
  }

  function renderMemberOption(props, option, { selected }) {
    const { key, ...rest } = props;
    return (
      <li key={key} {...rest}>
        <Checkbox checked={selected} sx={{ mr: 1 }} />
        <span className="filter-member-fullname">{option.fullname}</span>
        <span className="filter-member-username">@{option.username}</span>
      </li>
    );
  }

  const hasActiveFilters = () => {
    return (
      filters.title?.trim() || filters?.members?.length || !!filters.noMembers
    );
  };

  function handleMembersAutocompleteChange(_, selected) {
    let newMembers = selected.map(m => m.id);
    if (filters.members?.includes(CURRENT_USER_ID_PLACEHOLDER)) {
      newMembers = [CURRENT_USER_ID_PLACEHOLDER, ...newMembers];
    }
    updateFilter("members", newMembers);
  }

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleOpen}>
        <FilterList />
      </IconButton>

      <Popover
        open={isOpen}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: { width: 320, p: 2 },
          },
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Filter
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Title
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter card title..."
              value={localTitle}
              onChange={handleTitleChange}
            />
          </Box>
          <FormGroup row sx={{ mb: 1, alignItems: "center" }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="noMembers"
                  checked={!!filters.noMembers}
                  onChange={(_, checked) => updateFilter("noMembers", checked)}
                />
              }
              label="No members"
              sx={{ mr: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="assignedToMe"
                  checked={filters.members?.includes(
                    CURRENT_USER_ID_PLACEHOLDER
                  )}
                  onChange={handleMembersChange}
                />
              }
              label="Assigned to me"
              sx={{ mr: 2 }}
            />
          </FormGroup>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="selectAll"
                  checked={
                    memberOptions.length > 0 &&
                    memberOptions
                      .filter(m => m.id !== CURRENT_USER_ID_PLACEHOLDER)
                      .every(m => filters.members?.includes(m.id))
                  }
                  indeterminate={isSomeMembersSelected()}
                  onChange={handleMembersChange}
                  sx={{ mr: 1 }}
                />
              }
              label=""
              sx={{ mr: 2 }}
            />
            <Box className="filter-member-autocomplete" sx={{ flex: 1 }}>
              <Autocomplete
                multiple
                disableCloseOnSelect
                disableClearable
                options={memberOptions}
                getOptionLabel={option => option.label}
                value={memberOptions.filter(
                  m =>
                    filters.members?.includes(m.id) &&
                    m.id !== CURRENT_USER_ID_PLACEHOLDER
                )}
                onChange={handleMembersAutocompleteChange}
                renderOption={renderMemberOption}
                renderValue={() => null}
                renderInput={params => <TextField {...params} size="small" />}
                sx={{ mb: 0, width: "100%" }}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters()}
            >
              Clear All
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleClose}
              sx={{ ml: "auto" }}
            >
              Done
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
