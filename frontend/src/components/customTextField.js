import { TextField } from "@mui/material";

const CustomTextField = ({ label, name, value, onChange, type, required }) => {
  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      variant="outlined"
      margin="normal"
      required={required}
      InputLabelProps={{
        sx: { fontSize: "0.7rem" },
      }}
      InputProps={{
        sx: { fontSize: "0.7rem" },
      }}
    />
  );
};

export default CustomTextField;
