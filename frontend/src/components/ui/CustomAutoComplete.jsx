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
  const selectedOption = options.find(opt => opt._id === value) || null;

  const handleChange = (_, newValue) => {
    if (onChange) {
      onChange(newValue?._id ?? "");
    }
  };

  const renderOption = (props, option) => {
    const { key: _key, ...rest } = props;

    return (
      <li key={option._id} {...rest}>
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
      getOptionKey={option => option._id}
      isOptionEqualToValue={(option, val) => option?._id === val?._id}
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
