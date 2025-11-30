import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const filterOptions = createFilterOptions({
  matchFrom: "any",
  stringify: option => option.title,
});

export function CustomAutoComplete({
  label,
  id,
  name,
  options = [],
  fullWidth = true,
  className,
  sx,
  value,
  onChange,
  disabled,
  ...otherProps
}) {
  const selectedOption = options.find(opt => opt.id === value) || null;

  const handleChange = (_, newValue) => {
    if (onChange) {
      onChange(newValue?.id ?? "");
    }
  };

  const renderOption = (props, option) => {
    const { key: _key, ...rest } = props;
    const isSelected = option.id === value;

    return (
      <li
        key={option.id}
        {...rest}
        style={{
          ...rest.style,
          borderLeft: isSelected
            ? "3px solid #1976d2"
            : "3px solid transparent",
        }}
      >
        {option.title}
      </li>
    );
  };

  return (
    <Autocomplete
      id={id}
      className={className}
      options={options}
      filterOptions={filterOptions}
      getOptionLabel={option =>
        typeof option === "string" ? option : option?.title || ""
      }
      sx={{
        cursor: "pointer",
        "& .MuiInputBase-root": {
          cursor: "pointer",
        },
        "& .MuiInputBase-input": {
          cursor: "pointer",
          caretColor: "transparent",
          "&::selection": {
            backgroundColor: "transparent",
          },
        },
        "& .MuiInputBase-input:focus": {
          caretColor: "auto",
        },
      }}
      getOptionKey={option => option.id}
      isOptionEqualToValue={(option, val) => option?.id === val?.id}
      value={selectedOption}
      onChange={handleChange}
      disabled={disabled}
      fullWidth={fullWidth}
      disableClearable
      clearOnFocus
      renderOption={renderOption}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          name={name}
          sx={sx}
          onFocus={e => e.target.select()}
          onMouseUp={e => {
            e.preventDefault();
            e.target.select();
          }}
        />
      )}
      {...otherProps}
    />
  );
}
