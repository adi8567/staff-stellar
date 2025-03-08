
import React from 'react';
import { Link } from 'react-router-dom';
import { Employee, Role, Department } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmployeeCardProps {
  employee: Employee;
  role?: Role;
  department?: Department;
  detailed?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  role,
  department,
  detailed = false,
  onEdit,
  onDelete,
  className,
}) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
    on_leave: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    terminated: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-md animate-fade-up",
      detailed ? "p-0" : "p-4",
      className
    )}>
      {detailed ? (
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          <div className="p-8 bg-gradient-to-br from-employee to-employee-dark text-white flex flex-col items-center justify-center">
            <Avatar className="h-32 w-32 border-4 border-white/30">
              <AvatarImage src={employee.avatar} alt={`${employee.firstName} ${employee.lastName}`} />
              <AvatarFallback className="text-2xl">{getInitials(employee.firstName, employee.lastName)}</AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-2xl font-bold text-center">{employee.firstName} {employee.lastName}</h2>
            <p className="text-white/80 text-center mt-1">{role?.title || 'No role assigned'}</p>
            <Badge variant="outline" className="mt-3 border-white/30 text-white">
              {employee.status.replace('_', ' ').charAt(0).toUpperCase() + employee.status.replace('_', ' ').slice(1)}
            </Badge>
          </div>
          <div className="md:col-span-2 p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-muted-foreground mr-2" />
                <p className="text-sm">{employee.email}</p>
              </div>
              {employee.phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-muted-foreground mr-2" />
                  <p className="text-sm">{employee.phone}</p>
                </div>
              )}
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 text-muted-foreground mr-2" />
                <p className="text-sm">Hired on {formatDate(employee.hireDate)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Department</h3>
                <p className="text-base font-medium">{department?.name || 'Not assigned'}</p>
                {department?.description && (
                  <p className="text-sm text-muted-foreground mt-1">{department.description}</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Role</h3>
                <p className="text-base font-medium">{role?.title || 'Not assigned'}</p>
                {role?.description && (
                  <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                )}
              </div>
            </div>
            
            {(onEdit || onDelete) && (
              <div className="flex items-center justify-end space-x-2 pt-4 border-t">
                {onEdit && (
                  <Button variant="outline" size="sm" onClick={onEdit}>
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button variant="destructive" size="sm" onClick={onDelete}>
                    Delete
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <CardContent className="p-0 flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={employee.avatar} alt={`${employee.firstName} ${employee.lastName}`} />
            <AvatarFallback>{getInitials(employee.firstName, employee.lastName)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <Link to={`/employees/${employee.id}`} className="hover:underline">
              <h3 className="text-base font-medium truncate">{employee.firstName} {employee.lastName}</h3>
            </Link>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="truncate">{role?.title || 'No role'}</span>
              <span className="mx-1">•</span>
              <span className="truncate">{department?.name || 'No department'}</span>
            </div>
          </div>
          
          <Badge className={cn("ml-auto", statusColors[employee.status])}>
            {employee.status.replace('_', ' ').charAt(0).toUpperCase() + employee.status.replace('_', ' ').slice(1)}
          </Badge>
        </CardContent>
      )}
    </Card>
  );
};

export default EmployeeCard;
