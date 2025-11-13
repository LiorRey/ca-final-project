import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const menuProps = {
  disablePortal: true,
  slotProps: {
    root: {
      sx: {
        pointerEvents: "none",
      },
    },
    backdrop: {
      sx: {
        pointerEvents: "none",
      },
    },
  },
  PaperProps: {
    sx: {
      transformOrigin: "top left",
      backgroundColor: "var(--gray3)",
      color: "var(--gray1)",
      pointerEvents: "auto",
      position: "absolute",
      zIndex: 1,
    },
  },
};

const selectSx = {
  backgroundColor: "var(--gray3)",
  color: "var(--gray1)",
  borderColor: "var(--gray2)",
};

export default function CustomSelect({
  label,
  id,
  options = [],
  fullWidth = true,
  className,
  sx,
  open,
  labelId,
  ...otherProps
}) {
  const handleClick = event => {
    event.stopPropagation();
  };

  return (
    <FormControl
      fullWidth={fullWidth}
      className={className}
      focused={open}
      onClick={e => handleClick(e)}
    >
      <InputLabel
        id={labelId}
        className="card-form-select-label"
        sx={{
          color: "var(--form-section-label-color, rgba(255, 255, 255, 0.9))",
        }}
      >
        {label}
      </InputLabel>
      <Select
        id={id}
        labelId={labelId}
        label={label}
        sx={{ ...selectSx, ...sx }}
        open={open}
        MenuProps={menuProps}
        {...otherProps}
      >
        {options.map(option => (
          <MenuItem
            key={option.value}
            value={option.value}
            className="card-form-menu-item"
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
