import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const CustomDialog = ({
  open,
  onClose,
  title,
  message,
  actions,
  maxWidth = "sm",
  fullWidth = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="reusable-dialog-title"
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      sx={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <DialogTitle id="reusable-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
