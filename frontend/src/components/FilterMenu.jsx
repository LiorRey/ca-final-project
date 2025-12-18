import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import FilterList from "@mui/icons-material/FilterList";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Popover } from "./Popover";
import { useCardFilters } from "../hooks/useCardFilters";
import { getMembersFilterOptions } from "../services/filter-service";

export function FilterMenu() {
  const members = useSelector(state => state.boards.board.members);
  const currentUser = useSelector(state => state.auth.currentUser);
  const [isOpen, setIsOpen] = useState(false);
  const [localTitle, setLocalTitle] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    filters,
    updateFilterDebounced,
    updateFilter,
    clearAllFilters,
    hasActiveFilters,
  } = useCardFilters();
  const memberOptions = useMemo(
    () =>
      getMembersFilterOptions(members).filter(m => m.id !== currentUser._id),
    [members, currentUser]
  );

  function handleClearFilters() {
    setLocalTitle("");
    clearAllFilters();
  }

  function handleOpen(event) {
    setAnchorEl(event.currentTarget);
    setLocalTitle(filters.title || "");
    setIsOpen(true);
  }

  function handleClose() {
    setAnchorEl(null);
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
        newMembers = [...newMembers, currentUser._id];
      } else {
        newMembers = newMembers.filter(id => id !== currentUser._id);
      }
    } else if (checkboxName === "selectAll") {
      if (checked) {
        newMembers = memberOptions.map(m => m.id);
        if (filters.members?.includes(currentUser._id)) {
          newMembers = [currentUser._id, ...newMembers];
        }
      } else {
        newMembers = [];
        if (filters.members?.includes(currentUser._id)) {
          newMembers = [currentUser._id];
        }
      }
    }
    updateFilter("members", newMembers);
  }

  function isSomeMembersSelected() {
    if (!memberOptions || memberOptions.length === 0) return false;
    const selectedCount = memberOptions.filter(m =>
      filters.members?.includes(m.id)
    ).length;
    return selectedCount > 0 && selectedCount < memberOptions.length;
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

  function handleMembersAutocompleteChange(_, selected) {
    let newMembers = selected.map(m => m.id);
    if (filters.members?.includes(currentUser._id)) {
      newMembers = [currentUser._id, ...newMembers];
    }
    updateFilter("members", newMembers);
  }

  return (
    <>
      <button className="icon-button" onClick={handleOpen}>
        <FilterList />
      </button>
      <Popover
        isOpen={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        title="Filter"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        paperProps={{ sx: { width: 320, px: 1.5, pb: 1.5, pt: 1 } }}
      >
        <Box>
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
                  checked={filters.members?.includes(currentUser._id)}
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
                    memberOptions.every(m => filters.members?.includes(m.id))
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
                value={memberOptions.filter(m =>
                  filters.members?.includes(m.id)
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
