
import React from 'react';
import { cn } from '@/lib/utils';
import { Role, Department } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface RoleItemProps {
  role: Role;
  department?: Department;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

const RoleItem: React.FC<RoleItemProps> = ({
  role,
  department,
  onEdit,
  onDelete,
  className,
}) => {
  const levelColors = [
    'bg-gray-100 text-gray-800',
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-red-100 text-red-800',
  ];

  return (
    <Card className={cn(
      "hover:shadow-md transition-all animate-fade-up",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">{role.title}</h3>
              {role.isManager && (
                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                  Manager
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{role.description}</p>
            
            <div className="mt-4">
              <Badge className={cn(
                "text-xs font-medium",
                levelColors[role.level - 1] || levelColors[0]
              )}>
                Level {role.level}
              </Badge>
              
              {department && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {department.name}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-medium">Responsibilities:</h4>
          <ul className="space-y-1">
            {role.responsibilities.map((item, index) => (
              <li key={index} className="flex items-start text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {(onEdit || onDelete) && (
          <div className="mt-6 flex justify-end space-x-2">
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
      </CardContent>
    </Card>
  );
};

export default RoleItem;
