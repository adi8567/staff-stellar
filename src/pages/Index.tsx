
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';
import { api } from '@/lib/api';
import { Employee, Role, Department, PerformanceReview } from '@/lib/types';
import { 
  Users, 
  Briefcase, 
  Building2, 
  BarChart4, 
  UserPlus, 
  ArrowUpRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EmployeeCard from '@/components/EmployeeCard';
import PerformanceChart from '@/components/PerformanceChart';

const Index = () => {
  // State for animations
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => api.getDashboardStats(),
  });

  // Fetch employees
  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: () => api.getEmployees(),
  });

  // Fetch roles
  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => api.getRoles(),
  });

  // Fetch departments
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.getDepartments(),
  });

  // Fetch performance reviews
  const { data: performanceReviews } = useQuery({
    queryKey: ['performanceReviews'],
    queryFn: () => api.getPerformanceReviews(),
  });

  // Set loaded state after initial render to trigger animations
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Helper function to find role by ID
  const findRoleById = (roleId: string): Role | undefined => {
    return roles?.find(role => role.id === roleId);
  };

  // Helper function to find department by ID
  const findDepartmentById = (departmentId: string): Department | undefined => {
    return departments?.find(dept => dept.id === departmentId);
  };

  // Get recent employees (last 5)
  const recentEmployees = employees?.slice(0, 5) || [];

  return (
    <Layout>
      <div className="page-container space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome to the employee management system
            </p>
          </div>
          <Button asChild>
            <Link to="/employees/new">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Employee
            </Link>
          </Button>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Employees" 
            value={stats?.totalEmployees || 0}
            description={`${stats?.activeEmployees || 0} currently active`}
            icon={<Users className="h-5 w-5 text-employee" />}
            className="stagger-1 border-employee/20"
            iconClassName="bg-employee/10"
          />
          <StatCard 
            title="Job Roles" 
            value={stats?.rolesCount || 0}
            description="Defined in the system"
            icon={<Briefcase className="h-5 w-5 text-role" />}
            className="stagger-2 border-role/20"
            iconClassName="bg-role/10"
          />
          <StatCard 
            title="Departments" 
            value={stats?.departmentsCount || 0}
            description="Active departments"
            icon={<Building2 className="h-5 w-5 text-department" />}
            className="stagger-3 border-department/20"
            iconClassName="bg-department/10"
          />
          <StatCard 
            title="Avg. Performance" 
            value={stats?.avgPerformance?.toFixed(1) || "0.0"}
            description={`${stats?.recentReviews || 0} reviews in last 30 days`}
            icon={<BarChart4 className="h-5 w-5 text-performance" />}
            className="stagger-4 border-performance/20"
            iconClassName="bg-performance/10"
          />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent employees */}
          <Card className="lg:col-span-2 animate-fade-up stagger-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Employees</CardTitle>
                  <CardDescription>
                    Latest employees in the system
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/employees" className="flex items-center">
                    View all
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentEmployees.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No employees found
                  </div>
                ) : (
                  recentEmployees.map(employee => (
                    <EmployeeCard
                      key={employee.id}
                      employee={employee}
                      role={findRoleById(employee.roleId)}
                      department={findDepartmentById(employee.departmentId)}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance overview */}
          <div className="animate-fade-up stagger-3">
            <PerformanceChart 
              reviews={performanceReviews || []}
              type="bar"
            />
          </div>
          
          {/* Department distribution */}
          <Card className="lg:col-span-3 animate-fade-up stagger-4">
            <CardHeader className="pb-2">
              <CardTitle>Department Overview</CardTitle>
              <CardDescription>
                Distribution of employees across departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {departments?.map(department => {
                  const deptEmployees = employees?.filter(
                    emp => emp.departmentId === department.id
                  ) || [];
                  
                  const manager = deptEmployees.find(emp => {
                    const role = findRoleById(emp.roleId);
                    return role?.isManager;
                  });
                  
                  return (
                    <div key={department.id} className="animate-fade-in">
                      <Link to={`/departments/${department.id}`} className="block h-full">
                        <Card className="h-full hover:shadow-md transition-all border-department/20">
                          <CardHeader className="pb-2 bg-department/5">
                            <CardTitle className="text-base">{department.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-2xl font-bold">{deptEmployees.length}</p>
                                <p className="text-xs text-muted-foreground">Employees</p>
                              </div>
                              <div className="flex -space-x-2">
                                {deptEmployees.slice(0, 3).map(emp => (
                                  <div key={emp.id} className="rounded-full border-2 border-background overflow-hidden">
                                    <img
                                      src={emp.avatar || `https://i.pravatar.cc/32?u=${emp.id}`}
                                      alt={`${emp.firstName} ${emp.lastName}`}
                                      className="h-8 w-8 object-cover"
                                    />
                                  </div>
                                ))}
                                {deptEmployees.length > 3 && (
                                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium">
                                    +{deptEmployees.length - 3}
                                  </div>
                                )}
                              </div>
                            </div>
                            {manager && (
                              <div className="mt-3 pt-3 border-t text-sm">
                                <p className="text-xs text-muted-foreground">Manager</p>
                                <p className="font-medium">{manager.firstName} {manager.lastName}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
