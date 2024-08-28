import axios from "axios";
import { LOCAL_SERVER_URL } from "../../config/apiEndpoints.js";

const baseUrl = "users";

const authAPI = {
  login: async (credentials) => {
    const response = await axios.post(
      `${LOCAL_SERVER_URL}/${baseUrl}/login`,
      credentials
    );
    return response;
  },
};

export default authAPI;
