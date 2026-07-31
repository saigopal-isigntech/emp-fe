import { useQuery } from "@tanstack/react-query";
import { fetchEmployees } from "../services/employeeApi";

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}