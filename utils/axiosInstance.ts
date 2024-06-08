import axios from "axios";
import { Alert } from "react-native";


const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    "X-Api-Key": process.env.EXPO_PUBLIC_API_KEY,
  },
});


const _axiosResponseInterceptor = axiosInstance.interceptors.response.use(
  (response) => {
    //console.log({ response })
    return response.data;
  },
  async (error) => {
    const errorResponse = error?.response;

    if (errorResponse?.status === 500) {
      Alert.alert("Error:", 'Internal Server Error: Please Contact Support.');
      return;
    }


    if (error.code === 'ERR_NETWORK') {
      Alert.alert("Network Error", "Please check your network and try again");
      return;
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;