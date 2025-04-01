import axios from "./axiosInstance";

// api/sales.js
export const addSale = async (mesa, monto, tipoPago, propina) => {
  const response = await axios.post("/api/mesas", {
    numero_mesa: mesa,
    monto,
    tipo_pago: tipoPago,
    propina
  });
  return response.data;
};
