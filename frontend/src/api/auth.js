import axios from "./axiosInstance";

export const loginBar = async (nombre, password) => {
  const response = await axios.post("/api/login", {
    nombre: nombre,
    password: password
  });
  return response.data;
};
