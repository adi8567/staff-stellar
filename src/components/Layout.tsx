
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  Building2, 
  BarChart4, 
  Home, 
  Menu, 
  X,
  Settings,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setIsDarkMode(!isDarkMode);
  };
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Employees', href: '/employees', icon: Users },
    { name: 'Roles', href: '/roles', icon: Briefcase },
    { name: 'Departments', href: '/departments', icon: Building2 },
    { name: 'Performance', href: '/performance', icon: BarChart4 },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar for desktop */}
      <div className={cn(
        "fixed inset-y-0 z-50 flex w-72 flex-col bg-sidebar transition-transform duration-300 lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-lg">
              EM
            </div>
            <span className="text-sidebar-foreground font-semibold text-lg">
              EmpManage
            </span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden text-sidebar-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-md group transition-all duration-200",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive ? "text-sidebar-primary" : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground/80"
                  )} 
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-sidebar-border flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 mr-2" />
            ) : (
              <Moon className="h-4 w-4 mr-2" />
            )}
            {isDarkMode ? 'Light' : 'Dark'} Mode
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-sidebar-foreground/80 hover:text-sidebar-foreground"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center h-16 px-4 border-b">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-6 h-6 rounded-md flex items-center justify-center text-white font-bold text-sm">
                EM
              </div>
              <span className="font-semibold text-md">
                EmpManage
              </span>
            </Link>
          </div>
        </div>
        
        {/* Backdrop overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/30 lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
