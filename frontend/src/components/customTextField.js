import { TextField } from "@mui/material";

const CustomTextField = ({ label, name, value, onChange, type, required }) => {
  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      type={type}
      value={value}
      margin="normal"
      onChange={onChange}
      sx={{ height: "3rem" }}
      required={required}
      InputLabelProps={{
        sx: { fontSize: "0.7rem", color: "grey" },
      }}
      InputProps={{
        sx: {
          fontSize: "0.7rem",
          color: "white",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#313640", // Set the border color to grey
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#3c424f", // Optional: Change border color on hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#454c5c", // Optional: Change border color when focused
          },
        },
      }}
    />
  );
};

export default CustomTextField;
