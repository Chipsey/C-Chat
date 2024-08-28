import { useSelector } from "react-redux";
import localStorageService from "../utils/localStorage";

const useAuth = () => {
  const user = localStorageService.getItem("token");
  const isLoggedIn = Boolean(user);
  console.log(isLoggedIn);

  return { user, isLoggedIn };
};

export default useAuth;
