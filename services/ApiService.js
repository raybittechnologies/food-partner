import axios from 'axios';
import { BASE_URI } from '../config/url';



// const BASE_URL = 'http://192.168.244.187:5050/api/v1'; 


const apiService = async (endpoint, method = 'GET', data = null, headers = {}) => {
  const url = `${BASE_URI}${endpoint}`;


  const config = {
    method: method, 
    url: url,
    headers: {
      
      
      ...headers, 
    },
    data: data, 
  };

  try {
    const response = await axios(config);
    return { data: response.data, error: null }; // ✅ success format
  } catch (error) {
    const message = error?.response?.data?.message || error.message || 'Unknown error';
    return { data: null, error: message }; // ✅ error format
  }
};
export default apiService;
