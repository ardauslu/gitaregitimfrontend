const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const LOGOUT_REDIRECT_URI = "http://localhost:3000/login";
const REGISTER_REDIRECT_URI = "http://localhost:3000/home";

const config = {
  API_BASE_URL,
  LOGOUT_REDIRECT_URI,
  REGISTER_REDIRECT_URI,
};

export default config;