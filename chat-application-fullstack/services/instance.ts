import axios from "axios";

const useInstance = () => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  });

  return api;
};

export default useInstance;
