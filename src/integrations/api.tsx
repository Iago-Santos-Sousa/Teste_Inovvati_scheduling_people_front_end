import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api";

// Crie uma instância do Axios com a URL base da API
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Adicione um interceptor de requisição
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const acessToken: string | null = sessionStorage.getItem("user.acessToken");

  if (acessToken) {
    config.headers.Authorization = `Bearer ${acessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  function (response: AxiosResponse) {
    return response;
  },
  async function (error: AxiosError) {
    // Redirecionar para a tela de login caso o acessToken não seja mais válido
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      if (window.location.pathname !== "/") {
        window.location.replace("/");
        sessionStorage.clear();
      }
    }
    return Promise.reject(error);
  },
);

export default api;
