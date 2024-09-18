import { TextField } from "@mui/material";

const CustomTextField = ({
  label,
  name,
  value,
  onChange,
  type,
  required,
  multiline = false,
  onSubmit = () => {},
}) => {
  const handleKeyUp = (event) => {
    if (event.key === "Enter" && (!required || value.trim() !== "")) {
      onSubmit();
    }
  };

  return (
    <TextField
      fullWidth
      multiline={multiline}
      label={label}
      name={name}
      type={type}
      value={value}
      margin="normal"
      onChange={onChange}
      onKeyUp={handleKeyUp}
      required={required}
      InputLabelProps={{
        sx: { fontSize: "0.7rem", color: "grey" },
      }}
      InputProps={{
        sx: {
          borderRadius: "0.5rem",
          fontSize: "0.7rem",
          background: "white",
          alignItems: "flex-start",
          textAlign: "left",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0,0,0,0)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0,0,0,0)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0,0,0,0)",
          },
        },
      }}
    />
  );
};

export default CustomTextField;
