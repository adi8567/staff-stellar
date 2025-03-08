
import React from 'react';
import { PerformanceReview, Employee } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { cn } from '@/lib/utils';

interface PerformanceChartProps {
  reviews: PerformanceReview[];
  employee?: Employee;
  type?: 'bar' | 'radar';
  className?: string;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  reviews,
  employee,
  type = 'bar',
  className,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const barChartData = reviews.map(review => ({
    date: formatDate(review.date),
    rating: review.rating,
  }));

  // Create data for radar chart based on review strengths and areas to improve
  const radarData = () => {
    if (reviews.length === 0) return [];
    
    // Aggregate all strengths and areas to improve
    const allSkills = new Set<string>();
    const skills: Record<string, number> = {};
    
    reviews.forEach(review => {
      review.strengths.forEach(skill => {
        allSkills.add(skill);
        skills[skill] = (skills[skill] || 0) + 1;
      });
      
      review.areasToImprove.forEach(skill => {
        allSkills.add(skill);
        skills[skill] = (skills[skill] || 0) - 0.5; // Negative impact for areas to improve
      });
    });
    
    // Normalize skills based on number of reviews
    const maxCount = reviews.length;
    
    return Array.from(allSkills).map(skill => ({
      skill,
      value: Math.max(0, Math.min(5, (skills[skill] / maxCount) * 5 + 2.5)), // Scale to 0-5 range with baseline of 2.5
    }));
  };

  return (
    <Card className={cn("overflow-hidden animate-fade-in", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          {employee ? `${employee.firstName}'s Performance` : 'Performance Overview'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {reviews.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No performance data available
          </div>
        ) : type === 'bar' ? (
          <div className="h-72 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                    border: 'none' 
                  }} 
                />
                <Bar 
                  dataKey="rating" 
                  fill="#8b5cf6" 
                  radius={[4, 4, 0, 0]} 
                  barSize={36} 
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData()}>
                <PolarGrid strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 10 }} />
                <Radar 
                  name="Skills" 
                  dataKey="value" 
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.5} 
                  animationDuration={1500}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
