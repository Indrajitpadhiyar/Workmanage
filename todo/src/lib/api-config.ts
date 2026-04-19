export const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:8000";

export const getApiUrl = (endpoint: string) => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_URL}${cleanEndpoint}`;
};
