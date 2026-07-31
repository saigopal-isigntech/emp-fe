import type { Employee } from "../types/Employee";

interface ApiUser {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
  };
}

export async function fetchEmployees(): Promise<Employee[]> {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/users"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }

  const users: ApiUser[] = await response.json();

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    department: user.company.name,
    designation: "Software Engineer",
    status: "Active",
  }));
}