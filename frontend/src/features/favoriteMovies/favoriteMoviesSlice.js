import { createSlice } from "@reduxjs/toolkit";
import favoriteMoviesAPI from "./favoriteMoviesAPI";

const favoriteMoviesSlice = createSlice({
  name: "favoriteMovies",
  initialState: {
    movies: [],
  },
  reducers: {
    setFavoriteMovies: (state, action) => {
      state.movies = action.payload;
    },
    toggleFavoriteMovie: (state, action) => {
      const movieId = action.payload;
      if (state.movies.includes(movieId)) {
        state.movies = state.movies.filter((id) => id !== movieId);
      } else {
        state.movies.push(movieId);
      }
    },
  },
});

export const { setFavoriteMovies, toggleFavoriteMovie } =
  favoriteMoviesSlice.actions;
export default favoriteMoviesSlice.reducer;
