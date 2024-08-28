import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import "../../styles/movieCardStyles.css";

const TvCard = ({ movie, onClick, isActive }) => {
  const windowWidth = window.innerWidth;
  const primaryWidth = windowWidth / 30;

  return (
    <Card
      onClick={onClick}
      sx={{
        // width: primaryWidth * 3.5,
        margin: "auto",
        boxShadow: 3,
        borderRadius: 3,
        // height: primaryWidth * 4.5,
        backgroundColor: isActive
          ? "rgba(50, 50, 50, 0.8)"
          : "rgba(15, 15, 15, 0.8)",
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height={primaryWidth * 3}
          image={movie?.Poster}
          alt={movie?.Title}
        />
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between", // Space the content evenly
            height: primaryWidth,
          }}
        >
          <Typography gutterBottom variant="h8" component="div" color="white">
            <div
              className="card_movie_title"
              style={{
                maxHeight: "40px",
                overflowY: "auto",
              }}
            >
              {movie?.Title}
            </div>
          </Typography>
          <Typography
            variant="body3"
            component="div"
            color="white"
            sx={{
              mt: "auto", // Move the year to the bottom
            }}
          >
            <div class="d-flex justify-content-between">
              <div className="card_movie_year font-small">{movie?.Year}</div>
              {/* <div className="font-small align-content-center ">
                <span class="opacity-25"> IMDB</span>
                <span class="color-orange opacity-100"> {movie?.rating}</span>
              </div> */}
            </div>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TvCard;
