import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: agrega automáticamente el token a cada request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const barId = localStorage.getItem("barSeleccionado");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (barId) {
    config.headers["Bar-Seleccionado"] = barId;
  }

  return config;
});

export default instance;
