import axios from './axiosInstance';

export const saveCajaInicial = async (monto) => {
  const response = await axios.post('/api/caja', { monto });
  return response.data;
};

export const getCajaInicial = async () => {
  try {
    const response = await axios.get('/api/caja');
    return response.data;
  } catch (e) {
    if (e.response?.status === 404) return null;
    throw e;
  }
};
