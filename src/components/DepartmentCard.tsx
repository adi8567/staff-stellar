
import React from 'react';
import { Link } from 'react-router-dom';
import { Department, Employee } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users, Calendar } from 'lucide-react';

interface DepartmentCardProps {
  department: Department;
  manager?: Employee;
  employeeCount?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  manager,
  employeeCount = 0,
  onEdit,
  onDelete,
  className,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-md animate-fade-up",
      className
    )}>
      <CardHeader className="border-b bg-department/10 pb-4">
        <Link to={`/departments/${department.id}`} className="hover:underline">
          <h3 className="text-lg font-semibold">{department.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">{department.description}</p>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-full bg-department/10">
              <Users className="h-5 w-5 text-department" />
            </div>
            <div>
              <p className="text-sm font-medium">Team Size</p>
              <p className="text-2xl font-bold">{employeeCount}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-full bg-department/10">
              <Calendar className="h-5 w-5 text-department" />
            </div>
            <div>
              <p className="text-sm font-medium">Established</p>
              <p className="text-sm">{formatDate(department.createdAt)}</p>
            </div>
          </div>
        </div>
        
        {manager && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">Department Manager</p>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={manager.avatar} alt={`${manager.firstName} ${manager.lastName}`} />
                <AvatarFallback>{getInitials(manager.firstName, manager.lastName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{manager.firstName} {manager.lastName}</p>
                <p className="text-xs text-muted-foreground">{manager.email}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      {(onEdit || onDelete) && (
        <CardFooter className="border-t p-4 flex justify-end space-x-2">
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
        </CardFooter>
      )}
    </Card>
  );
};

export default DepartmentCard;
