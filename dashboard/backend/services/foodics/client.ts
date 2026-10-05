import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const foodicsClient = axios.create({
  baseURL: process.env.FOODICS_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

foodicsClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${process.env.FOODICS_API_TOKEN}`;

  return config;
});

export default foodicsClient;
