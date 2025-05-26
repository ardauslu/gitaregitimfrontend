const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://au.bishokudev.com";

const LOGOUT_REDIRECT_URI = "https://au.bishokudev.com/login";
const REGISTER_REDIRECT_URI = "https://au.bishokudev.com/home";

const config = {
  API_BASE_URL,
  LOGOUT_REDIRECT_URI,
  REGISTER_REDIRECT_URI,
};

export default config;