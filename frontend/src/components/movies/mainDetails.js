import React from "react";
import { Grid, Typography, Box } from "@mui/material";

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const primaryWidth = windowWidth / 30;

const MainDetails = ({ activeMovie }) => {
  return (
    <Grid container xl={12} ml={5} mb={5}>
      <Grid xl={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            minWidth: "100px",
          }}
        >
          <Typography
            className="opacity-75"
            sx={{ color: "white", textAlign: "left" }}
          >
            IMDB
          </Typography>
          <Typography
            sx={{
              color: "orange",
              textAlign: "left",
              fontSize: "larger",
              fontWeight: "bold",
            }}
            style={{ fontSize: primaryWidth * 0.5 }}
          >
            {activeMovie?.rating}
          </Typography>
        </Box>
      </Grid>
      <Grid xl={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            minWidth: "100px",
          }}
        >
          <Typography
            className="opacity-75"
            sx={{ color: "white", textAlign: "left" }}
          >
            Language
          </Typography>
          <Typography
            sx={{
              color: "white",
              textAlign: "left",
              fontSize: "larger",
              fontWeight: "bold",
            }}
          >
            {activeMovie?.language}
          </Typography>
        </Box>
      </Grid>
      <Grid xl={6}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            minWidth: "100px",
          }}
        >
          <Typography
            className="opacity-75"
            sx={{ color: "white", textAlign: "left" }}
          >
            Genres
          </Typography>
          <div
            class="mt-1 w-75"
            style={{
              display: "flex",
              flexWrap: "wrap",
              color: "white",
            }}
          >
            {activeMovie?.genres.map((genre, index) => (
              <span key={index}>
                {genre}
                <span class="opacity-0">--</span>{" "}
              </span>
            ))}
          </div>
        </Box>
      </Grid>
    </Grid>
  );
};

export default MainDetails;
