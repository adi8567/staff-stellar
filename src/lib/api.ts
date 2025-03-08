
import { Employee, Role, Department, PerformanceReview, DashboardStats } from './types';
import { toast } from '@/components/ui/use-toast';

// Mock data
const employees: Employee[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '(555) 123-4567',
    avatar: 'https://i.pravatar.cc/150?img=1',
    roleId: '1',
    departmentId: '1',
    hireDate: '2020-01-15',
    status: 'active',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    phone: '(555) 987-6543',
    avatar: 'https://i.pravatar.cc/150?img=5',
    roleId: '2',
    departmentId: '1',
    hireDate: '2019-03-22',
    status: 'active',
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@company.com',
    phone: '(555) 555-1212',
    avatar: 'https://i.pravatar.cc/150?img=3',
    roleId: '3',
    departmentId: '2',
    hireDate: '2021-07-10',
    status: 'active',
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Williams',
    email: 'emily.williams@company.com',
    phone: '(555) 444-3333',
    avatar: 'https://i.pravatar.cc/150?img=9',
    roleId: '4',
    departmentId: '3',
    hireDate: '2018-11-05',
    status: 'on_leave',
  },
  {
    id: '5',
    firstName: 'Robert',
    lastName: 'Brown',
    email: 'robert.brown@company.com',
    phone: '(555) 222-1111',
    avatar: 'https://i.pravatar.cc/150?img=8',
    roleId: '2',
    departmentId: '4',
    hireDate: '2022-02-18',
    status: 'active',
  },
];

const roles: Role[] = [
  {
    id: '1',
    title: 'CEO',
    description: 'Chief Executive Officer',
    responsibilities: ['Company strategy', 'Executive leadership', 'Board management'],
    departmentId: '1',
    level: 5,
    isManager: true,
  },
  {
    id: '2',
    title: 'CTO',
    description: 'Chief Technology Officer',
    responsibilities: ['Technology strategy', 'Engineering leadership', 'Product vision'],
    departmentId: '2',
    level: 4,
    isManager: true,
  },
  {
    id: '3',
    title: 'Senior Developer',
    description: 'Experienced software engineer',
    responsibilities: ['Code architecture', 'Mentoring', 'Technical decisions'],
    departmentId: '2',
    level: 3,
    isManager: false,
  },
  {
    id: '4',
    title: 'HR Manager',
    description: 'Human Resources Manager',
    responsibilities: ['Recruitment', 'Employee relations', 'Policy development'],
    departmentId: '3',
    level: 4,
    isManager: true,
  },
  {
    id: '5',
    title: 'Marketing Director',
    description: 'Head of Marketing',
    responsibilities: ['Brand strategy', 'Campaign management', 'Market analysis'],
    departmentId: '4',
    level: 4,
    isManager: true,
  },
];

const departments: Department[] = [
  {
    id: '1',
    name: 'Executive',
    description: 'Company leadership and strategy',
    managerId: '1',
    createdAt: '2015-01-01',
  },
  {
    id: '2',
    name: 'Engineering',
    description: 'Software development and technical operations',
    managerId: '2',
    createdAt: '2015-02-15',
  },
  {
    id: '3',
    name: 'Human Resources',
    description: 'Employee management and development',
    managerId: '4',
    createdAt: '2015-03-10',
  },
  {
    id: '4',
    name: 'Marketing',
    description: 'Brand management and customer acquisition',
    managerId: '5',
    createdAt: '2016-01-20',
  },
];

const performanceReviews: PerformanceReview[] = [
  {
    id: '1',
    employeeId: '2',
    reviewerId: '1',
    date: '2023-01-15',
    rating: 4.5,
    comments: 'Exceptional performance and leadership',
    strengths: ['Communication', 'Problem solving', 'Team leadership'],
    areasToImprove: ['Work-life balance'],
    goals: ['Lead a major project', 'Mentor junior employees'],
  },
  {
    id: '2',
    employeeId: '3',
    reviewerId: '2',
    date: '2023-02-05',
    rating: 4.2,
    comments: 'Strong technical skills and contributions',
    strengths: ['Technical expertise', 'Code quality', 'Innovation'],
    areasToImprove: ['Documentation', 'Meeting deadlines'],
    goals: ['Improve documentation practices', 'Learn a new technology'],
  },
  {
    id: '3',
    employeeId: '4',
    reviewerId: '1',
    date: '2023-01-20',
    rating: 3.8,
    comments: 'Good performer with room for growth',
    strengths: ['Organization', 'Process improvement', 'Employee advocacy'],
    areasToImprove: ['Assertiveness', 'Strategic thinking'],
    goals: ['Develop leadership skills', 'Implement new HR process'],
  },
  {
    id: '4',
    employeeId: '5',
    reviewerId: '1',
    date: '2023-03-10',
    rating: 4.0,
    comments: 'Consistent performer with creative ideas',
    strengths: ['Creativity', 'Market knowledge', 'Project management'],
    areasToImprove: ['Analytics', 'Technical skills'],
    goals: ['Improve data analysis skills', 'Lead a successful campaign'],
  },
];

// Simulate delay for API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Methods
export const api = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(800);
    return {
      totalEmployees: employees.length,
      activeEmployees: employees.filter(e => e.status === 'active').length,
      departmentsCount: departments.length,
      rolesCount: roles.length,
      recentReviews: performanceReviews.filter(
        r => new Date(r.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length,
      avgPerformance: performanceReviews.reduce((sum, review) => sum + review.rating, 0) / performanceReviews.length,
    };
  },

  // Employees
  getEmployees: async (): Promise<Employee[]> => {
    await delay(600);
    return [...employees];
  },
  
  getEmployee: async (id: string): Promise<Employee | undefined> => {
    await delay(400);
    const employee = employees.find(e => e.id === id);
    
    if (employee) {
      employee.performanceReviews = performanceReviews.filter(r => r.employeeId === id);
    }
    
    return employee;
  },
  
  createEmployee: async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
    await delay(800);
    const newEmployee = {
      ...employee,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    employees.push(newEmployee as Employee);
    toast({
      title: "Employee created",
      description: `${newEmployee.firstName} ${newEmployee.lastName} has been added to the system.`,
    });
    
    return newEmployee as Employee;
  },
  
  updateEmployee: async (id: string, employee: Partial<Employee>): Promise<Employee | undefined> => {
    await delay(800);
    const index = employees.findIndex(e => e.id === id);
    
    if (index !== -1) {
      employees[index] = { ...employees[index], ...employee };
      toast({
        title: "Employee updated",
        description: `${employees[index].firstName} ${employees[index].lastName}'s information has been updated.`,
      });
      return employees[index];
    }
    
    return undefined;
  },
  
  deleteEmployee: async (id: string): Promise<boolean> => {
    await delay(800);
    const index = employees.findIndex(e => e.id === id);
    
    if (index !== -1) {
      const employee = employees[index];
      employees.splice(index, 1);
      toast({
        title: "Employee removed",
        description: `${employee.firstName} ${employee.lastName} has been removed from the system.`,
        variant: "destructive",
      });
      return true;
    }
    
    return false;
  },

  // Roles
  getRoles: async (): Promise<Role[]> => {
    await delay(600);
    return [...roles];
  },
  
  getRole: async (id: string): Promise<Role | undefined> => {
    await delay(400);
    return roles.find(r => r.id === id);
  },
  
  createRole: async (role: Omit<Role, 'id'>): Promise<Role> => {
    await delay(800);
    const newRole = {
      ...role,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    roles.push(newRole as Role);
    toast({
      title: "Role created",
      description: `${newRole.title} role has been added to the system.`,
    });
    
    return newRole as Role;
  },
  
  updateRole: async (id: string, role: Partial<Role>): Promise<Role | undefined> => {
    await delay(800);
    const index = roles.findIndex(r => r.id === id);
    
    if (index !== -1) {
      roles[index] = { ...roles[index], ...role };
      toast({
        title: "Role updated",
        description: `${roles[index].title} role has been updated.`,
      });
      return roles[index];
    }
    
    return undefined;
  },
  
  deleteRole: async (id: string): Promise<boolean> => {
    await delay(800);
    const index = roles.findIndex(r => r.id === id);
    
    if (index !== -1) {
      const role = roles[index];
      roles.splice(index, 1);
      toast({
        title: "Role removed",
        description: `${role.title} role has been removed from the system.`,
        variant: "destructive",
      });
      return true;
    }
    
    return false;
  },

  // Departments
  getDepartments: async (): Promise<Department[]> => {
    await delay(600);
    return [...departments];
  },
  
  getDepartment: async (id: string): Promise<Department | undefined> => {
    await delay(400);
    return departments.find(d => d.id === id);
  },
  
  createDepartment: async (department: Omit<Department, 'id'>): Promise<Department> => {
    await delay(800);
    const newDepartment = {
      ...department,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    departments.push(newDepartment as Department);
    toast({
      title: "Department created",
      description: `${newDepartment.name} department has been added to the system.`,
    });
    
    return newDepartment as Department;
  },
  
  updateDepartment: async (id: string, department: Partial<Department>): Promise<Department | undefined> => {
    await delay(800);
    const index = departments.findIndex(d => d.id === id);
    
    if (index !== -1) {
      departments[index] = { ...departments[index], ...department };
      toast({
        title: "Department updated",
        description: `${departments[index].name} department has been updated.`,
      });
      return departments[index];
    }
    
    return undefined;
  },
  
  deleteDepartment: async (id: string): Promise<boolean> => {
    await delay(800);
    const index = departments.findIndex(d => d.id === id);
    
    if (index !== -1) {
      const department = departments[index];
      departments.splice(index, 1);
      toast({
        title: "Department removed",
        description: `${department.name} department has been removed from the system.`,
        variant: "destructive",
      });
      return true;
    }
    
    return false;
  },

  // Performance Reviews
  getPerformanceReviews: async (employeeId?: string): Promise<PerformanceReview[]> => {
    await delay(600);
    if (employeeId) {
      return performanceReviews.filter(r => r.employeeId === employeeId);
    }
    return [...performanceReviews];
  },
  
  getPerformanceReview: async (id: string): Promise<PerformanceReview | undefined> => {
    await delay(400);
    return performanceReviews.find(r => r.id === id);
  },
  
  createPerformanceReview: async (review: Omit<PerformanceReview, 'id'>): Promise<PerformanceReview> => {
    await delay(800);
    const newReview = {
      ...review,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    performanceReviews.push(newReview as PerformanceReview);
    
    // Find employee
    const employee = employees.find(e => e.id === review.employeeId);
    if (employee) {
      toast({
        title: "Performance review created",
        description: `Review for ${employee.firstName} ${employee.lastName} has been recorded.`,
      });
    }
    
    return newReview as PerformanceReview;
  },
  
  updatePerformanceReview: async (id: string, review: Partial<PerformanceReview>): Promise<PerformanceReview | undefined> => {
    await delay(800);
    const index = performanceReviews.findIndex(r => r.id === id);
    
    if (index !== -1) {
      performanceReviews[index] = { ...performanceReviews[index], ...review };
      
      // Find employee
      const employee = employees.find(e => e.id === performanceReviews[index].employeeId);
      if (employee) {
        toast({
          title: "Performance review updated",
          description: `Review for ${employee.firstName} ${employee.lastName} has been updated.`,
        });
      }
      
      return performanceReviews[index];
    }
    
    return undefined;
  },
  
  deletePerformanceReview: async (id: string): Promise<boolean> => {
    await delay(800);
    const index = performanceReviews.findIndex(r => r.id === id);
    
    if (index !== -1) {
      const review = performanceReviews[index];
      performanceReviews.splice(index, 1);
      
      // Find employee
      const employee = employees.find(e => e.id === review.employeeId);
      if (employee) {
        toast({
          title: "Performance review removed",
          description: `Review for ${employee.firstName} ${employee.lastName} has been removed.`,
          variant: "destructive",
        });
      }
      
      return true;
    }
    
    return false;
  },
};
