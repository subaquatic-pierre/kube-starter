import axios from 'axios';

const axiosServices = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3010/' });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.request.use(
  async (config) => {
    let token = '';
    if (typeof window !== undefined) {
      token =
        window.localStorage.getItem('token') ??
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjk1MjA0ODczLCJleHAiOjE2OTc3OTY4NzN9.hMnUMcvnfVKM_qbK21jr_RcVly7D6G8UAeeBOz83F18';
    }
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.log(error);
    // if (error.response.status === 401 && !window.location.href.includes('/login')) {
    //   window.location.pathname = '/login';
    // }
    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);

export default axiosServices;
