'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { DashboardChart } from '@/components/ui/DashboardChart';
import { Users, CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function AdminDashboardPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const tasksRes = await fetch(`${apiUrl}/api/tasks/all`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      const tasksData = await tasksRes.json();

      const membersRes = await fetch(`${apiUrl}/api/auth/users`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      const membersData = await membersRes.json();

      if (Array.isArray(tasksData)) setTasks(tasksData);
      // Admin ki profile members list aur count mein nahi aani chahiye
      if (Array.isArray(membersData)) setMembers(membersData.filter((u: any) => u.role !== 'admin'));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = [
    { 
        label: "Total Members", 
        value: members.filter(m => m.role !== 'admin').length, 
        icon: Users, 
        color: "text-blue-600", 
        bg: "bg-blue-100/50" 
    },
    { 
        label: "Completed Tasks", 
        value: tasks.filter(t => t.status === 'completed').length, 
        icon: CheckCircle2, 
        color: "text-green-600", 
        bg: "bg-green-100/50" 
    },
    { 
        label: "Pending Tasks", 
        value: tasks.filter(t => t.status === 'pending').length, 
        icon: Clock, 
        color: "text-orange-600", 
        bg: "bg-orange-100/50" 
    },
    { 
        label: "In Progress", 
        value: tasks.filter(t => t.status === 'in-progress').length, 
        icon: AlertCircle, 
        color: "text-purple-600", 
        bg: "bg-purple-100/50" 
    },
  ];

  // Calculate workload: Active tasks (pending + in-progress) per member
  const memberWorkload = members.map(member => {
    const activeTasksCount = tasks.filter(task => 
        task.assignee?._id === member._id && 
        (task.status === 'pending' || task.status === 'in-progress')
    ).length;
    
    return {
        ...member,
        activeTasks: activeTasksCount
    };
  }).sort((a, b) => b.activeTasks - a.activeTasks).slice(0, 5);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
            <Loader2 className="w-10 h-10 text-[#003631] animate-spin" />
        </div>
    );
  }

  return (
    <>
      <Header title="Dashboard Overview" />
      <main className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="border-none shadow-xl shadow-gray-200/40 rounded-[2rem] bg-white group hover:scale-[1.02] transition-all">
                <CardContent className="p-6 sm:p-8 flex items-center space-x-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:rotate-6 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-black text-[#003631] tracking-tight">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <Card className="lg:col-span-2 border-none shadow-xl shadow-gray-200/40 rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black text-[#003631]">Performance Metrics</CardTitle>
              <CardDescription>Live tracking of task completion trends vs target performance.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <DashboardChart tasks={tasks} />
            </CardContent>
          </Card>

          {/* Member Workload Preview */}
          <Card className="border-none shadow-xl shadow-gray-200/40 rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 pb-4">
               <CardTitle className="text-xl font-black text-[#003631]">Member Workload</CardTitle>
               <CardDescription>Current active tasks (In Progress & Pending)</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-5">
              {memberWorkload.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No active members found.</p>
              ) : (
                memberWorkload.map(user => (
                    <div key={user._id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-50 hover:border-emerald-100 transition-colors">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-white border-2 border-[#FFEDA8] overflow-hidden flex items-center justify-center font-bold text-[#003631] text-xs">
                            {user.avatar ? (
                                <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                            ) : (
                                user.name.charAt(0)
                            )}
                        </div>
                        <div>
                        <p className="text-sm font-black text-[#003631] leading-tight">{user.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user.designation || user.role}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-black text-[#003631]">{user.activeTasks}</p>
                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Tasks</p>
                    </div>
                    </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Tasks */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-2xl font-black text-[#003631] tracking-tight">Recent Activity</h2>
            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 border-gray-200">Latest Tasks</Badge>
          </div>
          <Card className="border-none shadow-xl shadow-gray-200/40 rounded-[2.5rem] overflow-hidden bg-white px-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-6">Task Title</th>
                    <th className="px-8 py-6 text-center">Assignee</th>
                    <th className="px-8 py-6 text-center">Status</th>
                    <th className="px-8 py-6 text-right rounded-tr-lg">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tasks.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <p className="text-gray-400 italic">No tasks found in the system yet.</p>
                      </td>
                    </tr>
                  ) : (
                    tasks.slice(0, 5).map(task => (
                        <tr key={task._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-6">
                            <p className="font-black text-[#003631] mb-1 group-hover:text-emerald-700 transition-colors">{task.title}</p>
                            <p className="text-[11px] text-gray-400 line-clamp-1 truncate w-64">{task.description}</p>
                        </td>
                        <td className="px-8 py-6">
                            <div className="flex items-center justify-center space-x-3">
                                <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-[10px] font-bold text-[#003631] overflow-hidden">
                                    {task.assignee?.avatar ? (
                                        <img src={task.assignee.avatar} className="w-full h-full object-cover" />
                                    ) : (
                                        task.assignee?.name?.charAt(0) || '?'
                                    )}
                                </div>
                                <span className="text-[11px] font-bold text-gray-600 truncate max-w-[100px]">{task.assignee?.name || 'Unassigned'}</span>
                            </div>
                        </td>
                        <td className="px-8 py-6">
                            <div className="flex justify-center">
                                <Badge variant={task.status === "completed" ? "success" : task.status === "in-progress" ? "default" : "warning"}>
                                    {task.status}
                                </Badge>
                            </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <span className="text-[11px] font-black text-gray-400 uppercase tracking-tighter">
                                {new Date(task.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                           </span>
                        </td>
                        </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

      </main>
    </>
  );
}
