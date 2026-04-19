"use client";
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardChartProps {
  tasks: any[];
}

export function DashboardChart({ tasks }: DashboardChartProps) {
  // Process real tasks data to create a 7-day performance trend
  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const data = [];

    // Create the last 7 days of data points
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dayLabel = days[d.getDay()];
        const dateString = d.toLocaleDateString();

        // Count tasks created/completed on this day
        const dayTasks = tasks.filter(task => {
            const taskDate = new Date(task.createdAt).toLocaleDateString();
            return taskDate === dateString;
        });

        const completed = dayTasks.filter(t => t.status === 'completed').length;
        const total = dayTasks.length;

        data.push({
            name: dayLabel,
            completed: completed,
            target: Math.max(total, 2) // Maintain a minimum 'target' for visual baseline
        });
    }

    return data;
  }, [tasks]);

  return (
    <div className="w-full h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#003631" stopOpacity={0.05}/>
              <stop offset="95%" stopColor="#003631" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fontWeight: 800 }}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fontWeight: 800 }}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <Tooltip 
            contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                padding: '12px',
                fontSize: '12px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="target" 
            stroke="#003631" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorTarget)" 
          />
          <Area 
            type="monotone" 
            dataKey="completed" 
            stroke="#10b981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorCompleted)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
