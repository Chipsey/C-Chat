import React from "react";
import { Grid, Typography, Box } from "@mui/material";

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const primaryWidth = windowWidth / 30;

const MainDetailsTV = ({ activeMovie }) => {
  return (
    <Grid container xl={12} ml={5} mb={5}>
      <Grid xl={4}>
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
            {activeMovie?.imdbRating}
          </Typography>
        </Box>
      </Grid>
      <Grid xl={4}>
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
            {activeMovie?.Language}
          </Typography>
        </Box>
      </Grid>
      <Grid xl={4}>
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
            {activeMovie?.Genre}
          </div>
        </Box>
      </Grid>
      <Grid xl={2} mt={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            minWidth: "100px",
            fontSize: "0.7rem",
          }}
        >
          <Typography
            className="opacity-75"
            sx={{ color: "white", textAlign: "left", fontSize: "0.7rem" }}
          >
            Released
          </Typography>
          <div
            class="mt-1 w-75"
            style={{
              display: "flex",
              flexWrap: "wrap",
              color: "white",
            }}
          >
            {activeMovie?.Released}
          </div>
        </Box>
      </Grid>
      <Grid xl={2} mt={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            minWidth: "100px",
            fontSize: "0.7rem",
          }}
        >
          <Typography
            className="opacity-75"
            sx={{ color: "white", textAlign: "left", fontSize: "0.7rem" }}
          >
            Director
          </Typography>
          <div
            class="mt-1 w-75"
            style={{
              display: "flex",
              flexWrap: "wrap",
              color: "white",
            }}
          >
            {activeMovie?.Director}
          </div>
        </Box>
      </Grid>
      <Grid xl={2} mt={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            minWidth: "100px",
            fontSize: "0.7rem",
          }}
        >
          <Typography
            className="opacity-75"
            sx={{ color: "white", textAlign: "left", fontSize: "0.7rem" }}
          >
            Writer
          </Typography>
          <div
            class="mt-1 w-75"
            style={{
              display: "flex",
              flexWrap: "wrap",
              color: "white",
            }}
          >
            {activeMovie?.Writer}
          </div>
        </Box>
      </Grid>
      <Grid xl={2} mt={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            minWidth: "100px",
            fontSize: "0.7rem",
          }}
        >
          <Typography
            className="opacity-75"
            sx={{ color: "white", textAlign: "left", fontSize: "0.7rem" }}
          >
            Actors
          </Typography>
          <div
            class="mt-1 w-75"
            style={{
              display: "flex",
              flexWrap: "wrap",
              color: "white",
            }}
          >
            {activeMovie?.Actors}
          </div>
        </Box>
      </Grid>
      <Grid xl={2} mt={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            minWidth: "100px",
            fontSize: "0.7rem",
          }}
        >
          <Typography
            className="opacity-75"
            sx={{ color: "white", textAlign: "left", fontSize: "0.7rem" }}
          >
            Country
          </Typography>
          <div
            class="mt-1 w-75"
            style={{
              display: "flex",
              flexWrap: "wrap",
              color: "white",
            }}
          >
            {activeMovie?.Country}
          </div>
        </Box>
      </Grid>
      <Grid xl={2} mt={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            minWidth: "100px",
            fontSize: "0.7rem",
          }}
        >
          <Typography
            className="opacity-75"
            sx={{ color: "white", textAlign: "left", fontSize: "0.7rem" }}
          >
            Total Seasons
          </Typography>
          <div
            class="mt-1 w-75"
            style={{
              display: "flex",
              flexWrap: "wrap",
              color: "white",
            }}
          >
            {activeMovie?.totalSeasons}
          </div>
        </Box>
      </Grid>
    </Grid>
  );
};

export default MainDetailsTV;
