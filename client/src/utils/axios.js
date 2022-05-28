import axios from "axios";

const instance = axios.create({
  //baseURL: "http://localhost:5000/api/",
  baseURL: "https://grosharies.herokuapp.com/api",
  timeout: 20000,
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

export default instance;
