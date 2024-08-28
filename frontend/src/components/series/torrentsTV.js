import React, { useEffect, useState } from "react";
import { Grid, Typography, Box, Button } from "@mui/material";
import CustomDialog from "../dialogBox";
import { SERIES_DETAILS } from "../../config/apiEndpoints";
import { fetchItems } from "../../api/api";

const TorrentsTV = ({ torrents, isLoad }) => {
  const windowWidth = window.innerWidth;
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSeedr = async (torrentUrl) => {
    try {
      await navigator.clipboard.writeText(torrentUrl);
      handleDialogOpen();
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const bytesToGB = (bytes) => {
    return (bytes / 1073741824).toFixed(2);
  };

  return (
    <Box mb={10} ml={5}>
      <CustomDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        title="Seedr Instructions"
        message="Log into Seedr & Simply press the 'Paste link URL here' field."
        actions={
          <>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                window.open("https://www.seedr.cc", "_blank");
                handleDialogClose();
              }}
              color="primary"
              autoFocus
            >
              OK
            </Button>
          </>
        }
      />
      <Typography
        variant="h6"
        sx={{ color: "white", opacity: "0.25", fontSize: "2rem" }}
      >
        Torrents
      </Typography>
      <Grid
        container
        xl={12}
        mb={2}
        mt={3}
        sx={{ color: "white", opacity: 0.5 }}
      >
        <Grid xl={2}>
          <span class="font-small">Episode</span>
        </Grid>
        <Grid xl={4}>
          {" "}
          <span class="font-small">Name</span>
        </Grid>
        <Grid xl={2}>
          {" "}
          <span class="font-small">Size</span>
        </Grid>
        <Grid xl={4}>
          {" "}
          <span class="font-small">Links</span>
        </Grid>
      </Grid>
      <div
        class="w-100 mb-3"
        style={{
          height: 0.5,
          backgroundColor: "grey",
          width: windowWidth * 0.5,
          opacity: "0.4",
        }}
      ></div>
      {(torrents == null || torrents == undefined || torrents == "") &&
      isLoad ? (
        <Typography sx={{ fontSize: "0.75rem", color: "white" }}>
          Oops! No Torrents Found.
        </Typography>
      ) : !isLoad ? (
        <Typography sx={{ fontSize: "0.75rem", color: "white" }}>
          Enter Season and Episode.
        </Typography>
      ) : (
        torrents.map((torrent) => (
          <Grid
            container
            xl={12}
            mb={3}
            key={torrent.id}
            sx={{ alignItems: "center" }}
          >
            <Grid xl={2} mb={3} ml={0}>
              <Typography sx={{ color: "white", textAlign: "left" }}>
                S{torrent?.season} E{torrent?.episode}
              </Typography>
            </Grid>
            <Grid xl={4} mb={3} ml={0}>
              <Typography
                fontSize="small"
                sx={{ color: "grey", textAlign: "left" }}
              >
                {torrent?.title}
              </Typography>
            </Grid>
            <Grid xl={2}>
              <Typography sx={{ color: "grey", textAlign: "left" }}>
                {bytesToGB(torrent?.size_bytes)} GB
              </Typography>
            </Grid>
            <Grid xl={4} sx={{ fontSize: "0.75rem" }}>
              <a href={torrent?.torrent_url}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor:
                      torrent?.type === "bluray" ? "green" : "white",
                    color: torrent?.type === "bluray" ? "white" : "black",
                    fontSize: "0.7rem",
                  }}
                >
                  Download
                </Button>
              </a>
              <a href={torrent?.magnet_url}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor:
                      torrent?.type === "bluray" ? "green" : "white",
                    color: torrent?.type === "bluray" ? "white" : "black",
                    marginLeft: "10px",
                    fontSize: "0.7rem",
                  }}
                >
                  Magnet
                </Button>
              </a>
              <Button
                variant="contained"
                onClick={() => handleSeedr(torrent?.torrent_url)}
                sx={{
                  backgroundColor:
                    torrent?.type === "bluray" ? "green" : "white",
                  color: torrent?.type === "bluray" ? "white" : "black",
                  marginLeft: "10px",
                  fontSize: "0.7rem",
                }}
              >
                Seedr
              </Button>
            </Grid>
            <div
              className="w-100"
              style={{
                height: 0.5,
                backgroundColor: "grey",
                opacity: "0.5",
              }}
            ></div>
          </Grid>
        ))
      )}
    </Box>
  );
};

export default TorrentsTV;
