export type EmployeeStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "TERMINATED";
export type DepartmentStatus = "ACTIVE" | "INACTIVE";
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY";
export type LeaveType = "CASUAL" | "SICK" | "ANNUAL" | "MATERNITY" | "PATERNITY" | "UNPAID";
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last?: boolean;
  first?: boolean;
  empty?: boolean;
  pageNo?: number;
  pageSize?: number;
}

export interface Employee {
  id?: number;
  userId?: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  dateOfJoining: string;
  salary: number | string;
  status: EmployeeStatus;
  departmentId: number;
  departmentName?: string;
  createdAt?: string;
  updatedAt?: string;

  // Convenience aliases for UI flexibility
  name?: string;
  department?: string;
  mobile?: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  status: DepartmentStatus;
  createdAt?: string;
  updatedAt?: string;
  employeeCount?: number;
}

export interface Attendance {
  id?: number;
  employeeId?: number;
  attendanceDate: string;
  checkIn?: string;
  checkOut?: string;
  workingHours?: number;
  status: AttendanceStatus;
  employeeName?: string;
  employeeCode?: string;
  createdAt?: string;
}

export interface LeaveRequest {
  id?: number;
  employeeId: number;
  employeeName?: string;
  employeeCode?: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  rejectionReason?: string | null;
  approvedBy?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardSummary {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalDepartments: number;
  presentToday: number;
  absentToday: number;
  halfDayToday: number;
  pendingLeaveRequests: number;
  approvedLeaveRequests: number;
  rejectedLeaveRequests: number;

  // UI convenience properties
  pendingLeaves?: number;
  employeesOnLeave?: number;
}

export interface AuthUser {
  userId: number;
  employeeId?: number;
  name: string;
  email: string;
  roles: string[];
  token: string;
  tokenType?: string;
  accessToken?: string;
}
