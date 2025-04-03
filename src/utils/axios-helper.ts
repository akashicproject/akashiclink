import axios from 'axios';

const createAxiosInstance = (baseURL: string | undefined) => {
  return axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });
};

export const axiosBase = createAxiosInstance(
  process.env.REACT_APP_API_BASE_URL
);
export const axiosBaseV1 = createAxiosInstance(
  process.env.REACT_APP_VERSION_ONE_API_BASE_URL
);
