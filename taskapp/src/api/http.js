import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

http.interceptors.request.use((config) => {
  const access = localStorage.getItem("access");
  if (access) config.headers.Authorization = `Bearer ${access}`;
  return config;
});

http.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
          { refresh }
        );
        localStorage.setItem("access", data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return http(original);
      }
    }
    throw error;
  }
);

export default http;
