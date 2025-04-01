import axios from "./axiosInstance";

// Agregar nueva mesa (cerrar una mesa)
export const addSale = async (mesa, monto, tipoPago, propina) => {
  const response = await axios.post("/api/mesas", {
    numero_mesa: mesa,
    monto,
    tipo_pago: tipoPago,
    propina
  });
  return response.data;
};

// Obtner todas las mesas de un bar
export const getSales = async () => {
  const response = await axios.get("/api/mesas");
  return response;
};

// Editar una mesa
export const editSale = async (id, updateFields) => {
  const response = await axios.put(`/api/mesas/${id}`, updateFields);
  console.log('Esto retorna el deleteSale', response)
  return response.data;
}

// Eliminar una mesa
export const deleteSale = async (id) => {
  const response = await axios.delete(`/api/mesas/${id}`);
  return response.data;
}