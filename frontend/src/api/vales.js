import axios from './axiosInstance';

export const getVales = () => {
    return axios.get('/api/vales');
};

export const addVale = (payload) => {
    return axios.post('/api/vales', payload);
};