import axios from "axios";
export const api = axios.create({
  baseURL: "https://techutsav-admin-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});
