import axios from './axiosInstance';

export const getEmployees = async () => {
    return axios.get('/api/empleados');
}

export const addEmployee = (payload) => {
    return axios.post('/api/empleados', payload);
};

