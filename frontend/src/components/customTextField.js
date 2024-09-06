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
          borderRadius: "0.5rem",
          fontSize: "0.7rem",
          background: "white",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0,0,0,0)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0,0,0,0)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0,0,0,0.05)",
          },
        },
      }}
    />
  );
};

export default CustomTextField;
