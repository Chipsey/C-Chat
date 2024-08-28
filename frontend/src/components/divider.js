import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

const Divider = ({ width }) => {
  return (
    <div
      class="w-100 mb-3"
      style={{
        height: 0.5,
        backgroundColor: "grey",
        width: width,
        opacity: "0.4",
      }}
    ></div>
  );
};

export default Divider;
