import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "../api/employeeApi";

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
    staleTime: 1000 * 60 * 5,
  });
}