import React from "react";
import { Grid, Typography } from "@mui/material";

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const primaryWidth = windowWidth / 30;
const primaryHeight = windowHeight / 40;

const MovieHeading = ({ activeMovie }) => {
  return (
    <Grid container ml={5}>
      <Typography
        sx={{
          marginTop: primaryHeight * 0.3,
          maxWidth: windowWidth * 0.45,
        }}
      >
        <div
          class="color-white align-content-end m-0 w-100 fw-600"
          style={{ fontSize: primaryWidth * 0.6 }}
        >
          {activeMovie?.title_english}
          <div class="opacity-50" style={{ fontSize: primaryWidth * 0.5 }}>
            {activeMovie?.year}
          </div>
        </div>
        <h4
          class="color-white w-100 mt-3 mb-3 fw-300 opacity-75"
          style={{
            maxHeight: "170px",
            overflowY: "auto",
            fontSize: "0.75rem",
          }}
        >
          {activeMovie?.description_full}
        </h4>
      </Typography>
    </Grid>
  );
};

export default MovieHeading;
