import axios from './axiosInstance';

export const getResumenDiario = async () => {
  const response = await axios.get('/api/resumen-diario');
  return response.data;
};

export const getMonthSummary = async () => {
  const response = await axios.get('/api/resumen-mensual');
  return response.data;
};
