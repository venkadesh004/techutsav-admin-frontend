import axios from "axios";
export const api = axios.create({
  baseURL: "https://techutsav-admin-backend.onrender.com",
  // baseURL: "http://localhost:3002",
  headers: {
    "Content-Type": "application/json",
  },
});
