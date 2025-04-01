import axios from './axiosInstance';

export const saveCajaInicial = async (monto) => {
  const response = await axios.post('/api/caja', { monto });
  return response.data;
};

export const getCajaInicial = async () => {
  const response = await axios.get('/api/caja');
  return response.data;
};
