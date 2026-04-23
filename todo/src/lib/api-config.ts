const rawApiUrl = import.meta.env.VITE_API_URL as string | undefined;
export const API_URL = rawApiUrl?.trim().replace(/\/$/, "") || "";

export const getApiUrl = (endpoint: string) => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return API_URL ? `${API_URL}${cleanEndpoint}` : cleanEndpoint;
};
