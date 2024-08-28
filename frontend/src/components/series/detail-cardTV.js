import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import "../../styles/movieCardStyles.css";

const DetailCardTV = ({ movie }) => {
  console.log(movie);
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const primaryWidth = windowWidth / 30;
  const primaryHeight = windowHeight / 40;

  return (
    <Card
      sx={{
        width: primaryWidth * 15,
        margin: "auto",
        boxShadow: 3,
        borderRadius: 5,
        height: primaryHeight * 35,
        backgroundColor: "rgba(20, 20, 20)",
        opacity: 0.5,
        filter: "blur(0px)",
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height={primaryHeight * 35}
          image={movie?.Poster}
          alt={movie?.Title}
        />
      </CardActionArea>
    </Card>
  );
};

export default DetailCardTV;
