import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import AutoAwesome from "@mui/icons-material/AutoAwesome";
import East from "@mui/icons-material/East";
import { usePopoverMenuContext } from "./PopoverMenuContext";
import ActionButton from "../ui/buttons/ActionButton";
import CustomSelect from "../ui/CustomSelect";

const SELECT_IDS = {
  BOARD: "card-board-select",
  LIST: "card-list-select",
  POSITION: "card-position-select",
};

export function CardActionForm({ onCopySubmit, onMoveSubmit, isCopyMode }) {
  const {
    values,
    handleChange,
    cardLabelsCount,
    cardMembersCount,

    //display values
    submitButtonText,

    //suggested list
    suggestedList,
    handleSuggestedClick,

    //select menu state handlers
    openSelectMenuId,
    handleSelectOpen,
    handleSelectClose,

    //select menu handlers
    handleBoardChange,
    handleListChange,
    handlePositionChange,
    boards,
    selectedBoardLists,
    maxPosition,
  } = usePopoverMenuContext();

  function handleSubmit(e) {
    e.preventDefault();

    if (isCopyMode) {
      const newTitle = values.title.trim();
      if (!newTitle) return;

      onCopySubmit({
        title: newTitle,
        boardId: values.boardId,
        listId: values.listId,
        position: parseInt(values.position),
        keepLabels: values.keepLabels,
        keepMembers: values.keepMembers,
      });
    } else {
      onMoveSubmit({
        boardId: values.boardId,
        listId: values.listId,
        position: parseInt(values.position),
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-form-menu">
      {/* Copy mode: Title input */}
      {isCopyMode && (
        <Box className="card-form-section">
          <Typography className="card-form-section-label">Title</Typography>
          <TextareaAutosize
            id="card-textfield"
            name="title"
            value={values.title}
            onChange={handleChange}
            minRows={2}
            autoFocus
            className="card-form-textarea"
          />
        </Box>
      )}

      {/* Copy mode: Keep labels and members checkboxes */}
      {isCopyMode && (
        <Box className="card-form-section">
          <Typography className="card-form-section-label">Keep...</Typography>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  name="keepLabels"
                  checked={values.keepLabels}
                  onChange={handleChange}
                  classes={{
                    root: "card-form-checkbox",
                  }}
                />
              }
              label={`Labels (${cardLabelsCount})`}
              className="card-form-checkbox-label"
            />
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  name="keepMembers"
                  checked={values.keepMembers}
                  onChange={handleChange}
                  classes={{
                    root: "card-form-checkbox",
                  }}
                />
              }
              label={`Members (${cardMembersCount})`}
              className="card-form-checkbox-label"
            />
          </Box>
        </Box>
      )}

      {/* Move mode: Suggested list section */}
      {!isCopyMode && suggestedList && (
        <Box className="card-form-suggested-section" sx={{ mb: 2 }}>
          <Box className="card-form-suggested-header" sx={{ my: 2 }}>
            <AutoAwesome className="card-form-suggested-icon" />
            <Typography className="card-form-suggested-text">
              Suggested
            </Typography>
          </Box>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<East />}
            onClick={handleSuggestedClick}
            className="card-form-suggested-button"
          >
            {suggestedList.title}
          </Button>
        </Box>
      )}

      {/* Destination selects section */}
      <Box sx={{ mb: 2 }}>
        {!isCopyMode && (
          <Typography className="card-form-section-title" sx={{ mb: 3 }}>
            Select destination
          </Typography>
        )}

        <Box sx={{ mb: 2 }}>
          <CustomSelect
            id={SELECT_IDS.BOARD}
            name="boardId"
            label="Board"
            labelId={`${SELECT_IDS.BOARD}-label`}
            value={values.boardId}
            open={openSelectMenuId === SELECT_IDS.BOARD}
            onOpen={() => handleSelectOpen(SELECT_IDS.BOARD)}
            onClose={handleSelectClose}
            onChange={handleBoardChange}
            options={boards.map(b => ({
              value: b._id,
              label: b.title,
            }))}
          />
        </Box>

        <Box
          className={"card-form-selects-row"}
          display={"flex"}
          gap={2}
          sx={{ mb: 2 }}
        >
          <CustomSelect
            id={SELECT_IDS.LIST}
            name="listId"
            label="List"
            labelId={`${SELECT_IDS.LIST}-label`}
            value={values.listId}
            open={openSelectMenuId === SELECT_IDS.LIST}
            onOpen={() => handleSelectOpen(SELECT_IDS.LIST)}
            onClose={handleSelectClose}
            onChange={handleListChange}
            options={selectedBoardLists.map(list => ({
              value: list.id,
              label: list.title,
            }))}
          />

          <CustomSelect
            id={SELECT_IDS.POSITION}
            name="position"
            label="Position"
            labelId={`${SELECT_IDS.POSITION}-label`}
            value={values.position.toString()}
            open={openSelectMenuId === SELECT_IDS.POSITION}
            onOpen={() => handleSelectOpen(SELECT_IDS.POSITION)}
            onClose={handleSelectClose}
            onChange={handlePositionChange}
            options={Array.from({ length: maxPosition }, (_, i) => ({
              value: i,
              label: (i + 1).toString(),
            }))}
          />
        </Box>
      </Box>

      {/* Submit button */}
      <Box display="flex" justifyContent="flex-end">
        <ActionButton
          type="submit"
          variant="contained"
          size="small"
          disabled={isCopyMode && !values.title.trim()}
        >
          {submitButtonText}
        </ActionButton>
      </Box>
    </form>
  );
}
