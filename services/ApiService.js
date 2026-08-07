import axios from 'axios';
import { BASE_URI } from '../config/url';





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
    return { data: response.data, error: null }; 
  } catch (error) {
    const message = error?.response?.data?.message || error.message || 'Unknown error';
    return { data: null, error: message }; // ✅ error format
  }
};
export default apiService;
