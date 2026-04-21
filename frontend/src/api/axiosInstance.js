import axios from "axios";

function normalizeApiBaseUrl(raw) {
  const fallback = "http://localhost:3000";
  if (!raw || typeof raw !== "string") return fallback;
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!trimmed) return fallback;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

const baseURL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

const instance = axios.create({
  baseURL,
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
