import { combineReducers } from "redux";
import authReducer from "../features/auth/authSlice";
import favoriteMoviesReducer from "../features/favoriteMovies/favoriteMoviesSlice";
import userReducer from "../features/user/userSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  favoriteMovies: favoriteMoviesReducer,
  user: userReducer,
});

export default rootReducer;
