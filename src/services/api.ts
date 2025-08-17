// src/services/api.ts
const API_DELAY = 500; // Simulation délai réseau

export const simulateApiCall = <T>(data: T, delay = API_DELAY): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const simulateApiError = (message: string, delay = API_DELAY): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay);
  });
};