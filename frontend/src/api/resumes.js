import axios from './axiosInstance';


export const getResumenDiario = async (fechaISO) => {
  const response = await axios.get('/api/resumen-diario', {
    params: { fecha: fechaISO },   // ⇦ se envía como query-param
  });
  return response.data;
};


export const getMonthSummary = async (fecha = '') => {
  const response = await axios.get(`/api/resumen-mensual?fecha=${fecha}`);
  return response.data;
};