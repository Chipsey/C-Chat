import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  CircularProgress,
  Box,
  Button,
  FormControl,
  InputLabel,
  FilledInput,
} from "@mui/material";
import { fetchItems } from "../api/api";
import { OMDB_LIST, SERIES_DETAILS } from "../config/apiEndpoints";
import Background from "../components/background";

import { useNavigate } from "react-router-dom";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

import LoadingScreen from "../components/loadingScreen";
import ErrorScreen from "../components/errorScreen";
import Divider from "../components/divider";

import "../styles/homeStyles.css";
import "../index.css";
import FilteringTV from "../components/series/filtering-tv";
import TVHeading from "../components/series/tvHeading";
import TvCard from "../components/series/tvCard";
import MainDetailsTV from "../components/series/mainDetailsTV";
import TorrentsTV from "../components/series/torrentsTV";
import DetailCardTV from "../components/series/detail-cardTV";
import localStorageService from "../utils/localStorage";

const TvPage = () => {
  const [movies, setMovies] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [cast, setCast] = useState([]);
  const [activeMovie, setActiveMovie] = useState(null);
  const [activeMovieIndex, setActiveMovieIndex] = useState(0);
  const [activeMovieIMDBID, setActiveMovieIMDBID] = useState("tt4574334");
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [finalPageNo, setFinalPageNo] = useState(1);
  const [movieCount, setMovieCount] = useState(null);
  const [query, setQuery] = useState("stranger");
  const [error, setError] = useState(null);
  const [isNoMovies, setIsNoMovies] = useState(false);
  const [torrents, setTorrents] = useState(null);
  const [filteredTorrents, setFilteredTorrents] = useState(null);
  const [torrentCount, setTorrentCount] = useState(0);
  const [season, setSeason] = useState("");
  const [episode, setEpisode] = useState("");
  const [isLoadTorrents, setIsLoadTorrents] = useState(false);
  const moviesPerPage = 8;
  const torrentsPerPageInSeries = 100;

  const extractNumber = (str) => {
    return str
      .split("")
      .filter((char) => !isNaN(char) && char !== " ")
      .join("");
  };

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesList = await fetchItems(
          `${OMDB_LIST}&s=${query}&page=${pageNo}&type=series`
        );
        if (moviesList?.Search?.length > 0) {
          setIsNoMovies(false);
          setMovies(moviesList?.Search);
          setActiveMovieIndex(0);
          setMovieCount(moviesList?.Search?.totalResults || 0);
          setActiveMovieIMDBID(moviesList?.Search[0]?.imdbID);
          setFinalPageNo(
            movieCount % moviesPerPage !== 0
              ? Math.floor(movieCount / moviesPerPage) + 1
              : Math.floor(movieCount / moviesPerPage)
          );
        } else {
          setIsNoMovies(true);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [query, pageNo]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (initialLoading) {
        setLoading(true);
        setInitialLoading(false);
      }
      setCast([]);
      try {
        setIsLoadTorrents(false);
        setTorrents(null);
        setFilteredTorrents(null);
        const movieDetails = await fetchItems(
          `${OMDB_LIST}&i=${activeMovieIMDBID}&plot=full`
        );

        setActiveMovie(movieDetails);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setInitialLoading(false);
        setError(error.message);
      }
    };

    fetchMovieDetails();
  }, [activeMovieIMDBID]);

  useEffect(() => {
    const fetchTorrentDetails = async () => {
      if (initialLoading) {
        setLoading(true);
        setInitialLoading(false);
      }
      try {
        const allTorrents = [];
        let currentPage = 1;
        let totalFetchedTorrents = 0;
        let totalTorrentCount = 0;

        do {
          const torrentList = await fetchItems(
            `${SERIES_DETAILS}?imdb_id=${extractNumber(activeMovieIMDBID)}&limit=100&page=${currentPage}`
          );

          const currentTorrents = torrentList?.torrents || [];
          totalTorrentCount = torrentList?.torrents_count || 0;

          allTorrents.push(...currentTorrents);
          totalFetchedTorrents += currentTorrents.length;
          currentPage++;
        } while (totalFetchedTorrents < totalTorrentCount);

        setTorrents(allTorrents);
        setFilteredTorrents(allTorrents);
        console.log(allTorrents.length);
        setTorrentCount(totalTorrentCount);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        setInitialLoading(false);
        setError(error.message);
      }
    };

    fetchTorrentDetails();
  }, [isLoadTorrents]);

  const handleMovieClick = async (movie, index) => {
    setActiveMovieIndex(index);
    setActiveMovieIMDBID(movie.imdbID);
  };

  const handleSearch = (text) => {
    const processedQuery = replaceSpacesWithPlus(text);
    setQuery(processedQuery);
  };

  function replaceSpacesWithPlus(sentence) {
    return sentence.split(" ").join("+");
  }

  const handleNextPage = () => {
    setPageNo((prevPageNo) => prevPageNo + 1);
    setActiveMovieIndex(0);
  };

  const handleFinalPage = () => {
    setPageNo(
      movieCount % moviesPerPage !== 0
        ? Math.floor(movieCount / moviesPerPage) + 1
        : Math.floor(movieCount / moviesPerPage)
    );
    setActiveMovieIndex(0);
  };

  const handlePreviousPage = () => {
    if (pageNo > 1) {
      setPageNo((prevPageNo) => prevPageNo - 1);
      setActiveMovieIndex(0);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  const filterTorrents = (season, episode) => {
    if (torrents) {
      setFilteredTorrents(
        torrents.filter(
          (torrent) => torrent.season === season && torrent.episode === episode
        )
      );
    }
  };

  const resetFilterTorrents = () => {
    setFilteredTorrents(torrents);
    setSeason("");
    setEpisode("");
  };

  function handleLogOut() {
    localStorageService.clear();
    navigate("/login");
  }

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  return (
    <Background backgroundImage={activeMovie?.Poster}>
      {loading ? (
        <LoadingScreen />
      ) : error ? (
        <ErrorScreen error={error} />
      ) : (
        <Grid container xl={12}>
          <Grid container xl={6}>
            <div className="z-1 fade-slide-up">
              <DetailCardTV movie={activeMovie}></DetailCardTV>
            </div>

            <div
              class="position-absolute fade-slide-up"
              style={{
                maxHeight: "90vh",
                overflowX: "clip",
                maxWidth: windowWidth * 0.5,
                overflowY: "auto",
                marginBottom: "10vh",
              }}
            >
              <TVHeading activeMovie={activeMovie} />
              <MainDetailsTV activeMovie={activeMovie} />
              <Divider />

              {!isLoadTorrents ? (
                <Grid item xl={2} m={5}>
                  <Button
                    variant="contained"
                    sx={{
                      height: "100%",
                      fontSize: "0.75rem",
                      color: "white",
                      backgroundColor: "grey",
                    }}
                    onClick={() => setIsLoadTorrents(true)}
                    fullWidth
                  >
                    Load Torrents
                  </Button>
                </Grid>
              ) : (
                <Grid container mt={5} mb={3} ml={3} xl={8} spacing={1}>
                  <Grid item xl={3}>
                    <FormControl
                      variant="filled"
                      sx={{
                        backgroundColor: "grey",
                        borderRadius: "10px",
                        fontSize: "0.75rem",
                      }}
                      fullWidth
                    >
                      <InputLabel
                        sx={{
                          fontSize: "0.75rem",
                          "&.Mui-focused": {
                            color: "white",
                          },
                        }}
                      >
                        Season
                      </InputLabel>
                      <FilledInput
                        type="number"
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                        sx={{
                          fontSize: "0.75rem",
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xl={3}>
                    <FormControl
                      variant="filled"
                      sx={{
                        backgroundColor: "grey",
                        borderRadius: "10px",
                        fontSize: "0.75rem",
                      }}
                      fullWidth
                    >
                      <InputLabel
                        sx={{
                          fontSize: "0.75rem",
                          "&.Mui-focused": {
                            color: "white",
                          },
                        }}
                      >
                        Episode
                      </InputLabel>
                      <FilledInput
                        type="number"
                        value={episode}
                        onChange={(e) => setEpisode(e.target.value)}
                        sx={{
                          fontSize: "0.75rem",
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xl={3}>
                    <Button
                      variant="contained"
                      color="success"
                      sx={{
                        height: "100%",
                        fontSize: "0.75rem",
                        color: "white",
                      }}
                      onClick={() => filterTorrents(season, episode)}
                      fullWidth
                      disabled={season == "" || episode == ""}
                    >
                      Search
                    </Button>
                  </Grid>
                  <Grid item xl={3}>
                    <Button
                      variant="contained"
                      sx={{
                        height: "100%",
                        fontSize: "0.75rem",
                        color: "white",
                        backgroundColor: "grey",
                      }}
                      onClick={() => resetFilterTorrents()}
                      fullWidth
                      disabled={season == "" || episode == ""}
                    >
                      Reset
                    </Button>
                  </Grid>
                </Grid>
              )}
              <TorrentsTV torrents={filteredTorrents} isLoad={isLoadTorrents} />
            </div>
          </Grid>
          <Grid
            container
            xl={5}
            ml={12}
            className="z2"
            style={{
              maxHeight: "95vh",
              overflowX: "clip",
              overflowY: "auto",
            }}
          >
            {/* Heading */}
            <Grid container spacing={2} xl={12}>
              <Grid xl={4} sx={{ alignContent: "center" }}>
                <h1 className="z0 color-white w-100 fw-700 text-center m-0 align-content-end">
                  Xillica Series
                </h1>
                <h4 className="z0 color-white w-100 fw-200 text-center bg font-small m-0">
                  Surf Your Favorite Series
                </h4>
              </Grid>
              <Grid item xl={4} sx={{ alignContent: "center" }}>
                <Button
                  fullWidth
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  <Grid>
                    <h3 className="z0 color-white  w-100 fw-700 text-center m-0 align-content-end">
                      Xillica Movies
                    </h3>
                  </Grid>
                </Button>
              </Grid>
              <Grid item xl={2} sx={{ alignContent: "center" }}>
                <Button fullWidth>
                  <Grid>
                    <h3 className="z0 color-white w-100 fw-700 text-center m-0 align-content-end">
                      Profile
                    </h3>
                  </Grid>
                </Button>
              </Grid>
              <Grid item xl={2} sx={{ alignContent: "center" }}>
                <Button fullWidth onClick={handleLogOut}>
                  <Grid>
                    <h3 className="z0 color-white w-100 fw-700 text-center m-0">
                      Log Out
                    </h3>
                  </Grid>
                </Button>
              </Grid>
            </Grid>
            {/* Heading */}

            <Grid xl={12}>
              <FilteringTV handleSearch={handleSearch} />
            </Grid>

            {isNoMovies && initialLoading ? (
              <Grid xl={12}>
                <Typography sx={{ color: "grey", textAlign: "left" }}>
                  Nothing Found yet! Keep typing..
                </Typography>
              </Grid>
            ) : (
              <Grid
                container
                xl={12}
                spacing={2}
                style={{
                  maxHeight: "60vh",
                  overflowX: "clip",
                  overflowY: "auto",
                }}
              >
                {movies.map((item, index) => (
                  <Grid item xl={3} mb={1} key={item.imdbID}>
                    <TvCard
                      movie={item}
                      onClick={() => handleMovieClick(item, index)}
                      isActive={index === activeMovieIndex}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 2,
                marginBottom: 2,
                width: "100%", // Ensure the Box stretches the full width of the container
              }}
            >
              <Button
                variant="contained"
                onClick={() => setPageNo(1)}
                disabled={pageNo === 1}
                sx={{ marginRight: 1, backgroundColor: "grey", color: "black" }}
              >
                <KeyboardDoubleArrowLeftIcon />
              </Button>
              <Button
                variant="contained"
                onClick={handlePreviousPage}
                disabled={pageNo === 1}
                sx={{
                  backgroundColor: "white",
                  color: "black",
                }}
              >
                <KeyboardArrowLeftIcon />
              </Button>
              {/* <Typography
                ml={1}
                mr={1}
                sx={{ color: "grey", textAlign: "center", fontSize: "0.7rem" }}
              >
                Page {pageNo}
              </Typography> */}
              <Button
                variant="contained"
                onClick={handleNextPage}
                disabled={moviesPerPage * pageNo >= movieCount}
                sx={{
                  marginRight: 1,
                  backgroundColor: "white",
                  color: "black",
                }}
              >
                <KeyboardArrowRightIcon />
              </Button>
              <Button
                variant="contained"
                onClick={handleFinalPage}
                disabled={moviesPerPage * pageNo >= movieCount}
                sx={{ backgroundColor: "grey", color: "black" }}
              >
                <KeyboardDoubleArrowRightIcon />
              </Button>
              {loading && <CircularProgress />}
            </Box>
          </Grid>
        </Grid>
      )}
    </Background>
  );
};

export default TvPage;
