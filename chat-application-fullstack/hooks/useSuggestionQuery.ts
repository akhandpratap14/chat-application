"use client";

import useInstance from "@/services/instance";
import { useQuery } from "@tanstack/react-query";

export function useSuggestionQuery(search: string) {
  const api = useInstance();

  return useQuery({
    queryKey: ["suggestions", search],
    queryFn: async () => {
      if (!search) return [];
      const res = await api.get(`suggestions?search=${search}`);
      return res.data; 
    },
    enabled: search.length > 0,
    staleTime: 5 * 60 * 1000, 
  });
}
