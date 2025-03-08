
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { Role, Department } from '@/lib/types';
import { 
  Search, 
  Plus, 
  SlidersHorizontal,
  Briefcase 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import RoleItem from '@/components/RoleItem';

const Roles = () => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // State for role dialog
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    departmentId: '',
    level: 1,
    isManager: false,
    responsibilities: ['']
  });

  // Fetch roles
  const { data: roles, isLoading: isLoadingRoles, refetch: refetchRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => api.getRoles(),
  });

  // Fetch departments
  const { data: departments, isLoading: isLoadingDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.getDepartments(),
  });

  // Helper function to find department by ID
  const findDepartmentById = (departmentId: string): Department | undefined => {
    return departments?.find(dept => dept.id === departmentId);
  };

  // Filter and search roles
  const filteredRoles = roles?.filter(role => {
    const matchesSearch = 
      searchQuery === '' || 
      role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesDepartment = 
      departmentFilter === 'all' || 
      role.departmentId === departmentFilter;
      
    const matchesLevel = 
      levelFilter === 'all' || 
      role.level.toString() === levelFilter;
      
    return matchesSearch && matchesDepartment && matchesLevel;
  }) || [];

  // Level options
  const levelOptions = [
    { value: 'all', label: 'All Levels' },
    { value: '1', label: 'Level 1' },
    { value: '2', label: 'Level 2' },
    { value: '3', label: 'Level 3' },
    { value: '4', label: 'Level 4' },
    { value: '5', label: 'Level 5' },
  ];

  const openCreateDialog = () => {
    setDialogMode('create');
    setSelectedRoleId(null);
    setFormValues({
      title: '',
      description: '',
      departmentId: departments?.[0]?.id || '',
      level: 1,
      isManager: false,
      responsibilities: ['']
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (role: Role) => {
    setDialogMode('edit');
    setSelectedRoleId(role.id);
    setFormValues({
      title: role.title,
      description: role.description,
      departmentId: role.departmentId,
      level: role.level,
      isManager: role.isManager,
      responsibilities: [...role.responsibilities]
    });
    setIsDialogOpen(true);
  };

  const handleDeleteRole = async (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      await api.deleteRole(roleId);
      refetchRoles();
    }
  };

  const handleAddResponsibility = () => {
    setFormValues({
      ...formValues,
      responsibilities: [...formValues.responsibilities, '']
    });
  };

  const handleResponsibilityChange = (index: number, value: string) => {
    const newResponsibilities = [...formValues.responsibilities];
    newResponsibilities[index] = value;
    setFormValues({
      ...formValues,
      responsibilities: newResponsibilities
    });
  };

  const handleRemoveResponsibility = (index: number) => {
    if (formValues.responsibilities.length > 1) {
      const newResponsibilities = [...formValues.responsibilities];
      newResponsibilities.splice(index, 1);
      setFormValues({
        ...formValues,
        responsibilities: newResponsibilities
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty responsibilities
    const responsibilities = formValues.responsibilities.filter(r => r.trim() !== '');
    
    if (dialogMode === 'create') {
      await api.createRole({
        ...formValues,
        responsibilities
      });
    } else if (dialogMode === 'edit' && selectedRoleId) {
      await api.updateRole(selectedRoleId, {
        ...formValues,
        responsibilities
      });
    }
    
    setIsDialogOpen(false);
    refetchRoles();
  };

  const isLoading = isLoadingRoles || isLoadingDepartments;

  return (
    <Layout>
      <div className="page-container space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
            <p className="text-muted-foreground mt-1">
              Manage job roles and responsibilities
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Role
          </Button>
        </div>

        {/* Search and filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {levelOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-primary/10 text-primary" : ""}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Advanced filters */}
          {showFilters && (
            <Card className="animate-fade-in">
              <CardContent className="p-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Department</label>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments?.map(department => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Role list */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="h-5 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                    <div className="space-y-2 pt-4">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-4/5"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredRoles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRoles.map(role => (
                <RoleItem
                  key={role.id}
                  role={role}
                  department={findDepartmentById(role.departmentId)}
                  onEdit={() => openEditDialog(role)}
                  onDelete={() => handleDeleteRole(role.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Briefcase className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No roles found</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                {searchQuery || departmentFilter !== 'all' || levelFilter !== 'all'
                  ? "Try adjusting your search or filters"
                  : "Add your first role to get started"}
              </p>
              {!searchQuery && departmentFilter === 'all' && levelFilter === 'all' && (
                <Button onClick={openCreateDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Role
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Create/Edit Role Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {dialogMode === 'create' ? 'Create New Role' : 'Edit Role'}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === 'create' 
                  ? 'Add a new job role to the organization' 
                  : 'Update the details of this job role'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formValues.title}
                  onChange={(e) => setFormValues({...formValues, title: e.target.value})}
                  placeholder="e.g. Software Engineer"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formValues.description}
                  onChange={(e) => setFormValues({...formValues, description: e.target.value})}
                  placeholder="Brief description of the role"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    value={formValues.departmentId} 
                    onValueChange={(value) => setFormValues({...formValues, departmentId: value})}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments?.map(department => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select 
                    value={formValues.level.toString()} 
                    onValueChange={(value) => setFormValues({...formValues, level: parseInt(value)})}
                  >
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(level => (
                        <SelectItem key={level} value={level.toString()}>
                          Level {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isManager"
                  checked={formValues.isManager}
                  onChange={(e) => setFormValues({...formValues, isManager: e.target.checked})}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isManager">This is a management position</Label>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Responsibilities</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleAddResponsibility}
                  >
                    Add
                  </Button>
                </div>
                
                {formValues.responsibilities.map((responsibility, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={responsibility}
                      onChange={(e) => handleResponsibilityChange(index, e.target.value)}
                      placeholder={`Responsibility ${index + 1}`}
                    />
                    {formValues.responsibilities.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveResponsibility(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              <DialogFooter>
                <Button type="submit">
                  {dialogMode === 'create' ? 'Create Role' : 'Update Role'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Roles;
