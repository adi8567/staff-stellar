
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  roleId: string;
  departmentId: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  performanceReviews?: PerformanceReview[];
}

export interface Role {
  id: string;
  title: string;
  description: string;
  responsibilities: string[];
  departmentId: string;
  level: number;
  isManager: boolean;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  managerId?: string;
  parentDepartmentId?: string;
  createdAt: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  date: string;
  rating: number;
  comments: string;
  strengths: string[];
  areasToImprove: string[];
  goals: string[];
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  departmentsCount: number;
  rolesCount: number;
  recentReviews: number;
  avgPerformance: number;
}
