import React from "react";
import { Card, CardActionArea, CardMedia } from "@mui/material";
import "../../styles/movieCardStyles.css";

const DetailCard = ({ movie }) => {
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
          image={movie?.large_cover_image}
          alt={movie?.title_english}
        />
      </CardActionArea>
    </Card>
  );
};

export default DetailCard;
