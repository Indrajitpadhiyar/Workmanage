'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { CheckCircle2, Clock, PlayCircle, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { UpdateTaskModal } from '@/components/UpdateTaskModal';

export default function MemberDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      // Fetch profile
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userData = await userRes.json();
      
      // Fetch my tasks
      const tasksRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/tasks/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const tasksData = await tasksRes.json();

      if (userRes.ok) setUser(userData);
      if (Array.isArray(tasksData)) setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = [
    { label: "Total Tasks", value: tasks.length, icon: Clock, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "In Progress", value: tasks.filter(t => t.status === 'in-progress').length, icon: PlayCircle, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Completed", value: tasks.filter(t => t.status === 'completed').length, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
    { label: "Pending", value: tasks.filter(t => t.status === 'pending').length, icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
              <Loader2 className="w-10 h-10 text-[#003631] animate-spin" />
          </div>
      );
  }

  return (
    <>
      <Header title={`Welcome back, ${user?.name?.split(' ')[0] || 'Member'} 👋`} />
      <main className="p-4 sm:p-8 max-w-6xl mx-auto w-full space-y-8">
        
        {/* Intro */}
        <div className="bg-gradient-to-r from-[#003631] to-[#005047] rounded-[2.5rem] p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
             <h2 className="text-2xl sm:text-4xl font-extrabold mb-4 leading-tight">You have {tasks.filter(t => t.status !== 'completed').length} active tasks that need your attention.</h2>
             <p className="text-white/70 mb-8 text-lg font-medium">Keep hitting your milestones! Your current productivity is outstanding.</p>
             <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-[#FFEDA8] text-[#003631] hover:bg-[#FFEDA8]/90 rounded-2xl px-8 py-4 text-sm font-bold shadow-xl border-none w-full sm:w-auto">Start Working</Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-2xl px-8 w-full sm:w-auto">Quick Support</Button>
             </div>
          </div>
          <div className="absolute right-[-5%] top-[-20%] w-80 h-80 bg-[#FFEDA8] rounded-full blur-[100px] opacity-10"></div>
          <div className="absolute right-[10%] bottom-[-20%] w-64 h-64 bg-emerald-400 rounded-full blur-[80px] opacity-10"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="border-none shadow-xl shadow-gray-200/40 rounded-3xl bg-white overflow-hidden group hover:scale-[1.02] transition-all">
                <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:rotate-6 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold text-[#003631]">{stat.value}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Tasks list */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-extrabold text-[#003631]">Assigned Tasks</h3>
              <Badge variant="outline" className="text-[10px] px-3 font-bold uppercase tracking-wider">{tasks.length} Total</Badge>
            </div>
            
            <div className="space-y-4">
              {tasks.length === 0 ? (
                  <Card className="p-12 text-center border-dashed border-2 border-gray-100 bg-gray-50/50 rounded-[2.5rem]">
                      <p className="text-gray-400 font-medium italic">No tasks assigned yet. Enjoy your free time!</p>
                  </Card>
              ) : (
                tasks.map(task => (
                    <Card key={task._id} className="border-none shadow-lg shadow-gray-200/30 hover:shadow-xl transition-all rounded-[2rem] bg-white group border border-gray-50">
                      <CardContent className="p-7 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div className="space-y-2">
                          <h3 className="text-lg font-extrabold text-[#003631]">{task.title}</h3>
                          <p className="text-xs text-gray-500 line-clamp-1 max-w-md">{task.description}</p>
                          <div className="flex gap-4 pt-1">
                             <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                <Clock size={14} className="text-blue-500" />
                                {new Date(task.createdAt || Date.now()).toLocaleDateString()}
                             </div>
                             {task.remarks && (
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                                    <CheckCircle2 size={14} />
                                    Updated
                                </div>
                             )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                           <Badge variant={task.status === "completed" ? "success" : task.status === "in-progress" ? "default" : "warning"}>
                             {task.status}
                           </Badge>
                           <button 
                             onClick={() => setSelectedTask(task)}
                             className="text-xs font-bold text-[#003631] hover:underline flex items-center gap-1 group/btn"
                           >
                             Update Task <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                           </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </div>

          {/* Activity Feed / Remarks */}
          <div className="space-y-6">
            <h3 className="text-2xl font-extrabold text-[#003631]">Last Remarks</h3>
            <div className="space-y-4">
              {tasks.filter(t => t.remarks).length === 0 ? (
                  <p className="text-xs text-gray-400 italic bg-gray-50 p-6 rounded-2xl border-dashed border-2 border-gray-100">No update history available.</p>
              ) : (
                tasks.filter(t => t.remarks).slice(0, 3).map(task => (
                    <Card key={task._id} className="border-none bg-[#f3fdf8] shadow-none border border-green-100 rounded-3xl overflow-hidden">
                        <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-extrabold text-[#003631] text-sm uppercase tracking-tight">{task.title}</h4>
                            <span className="text-[10px] font-bold text-emerald-600/60">{task.status}</span>
                        </div>
                        <p className="text-sm text-gray-600 font-medium italic">"{task.remarks}"</p>
                        <div className="mt-4 pt-4 border-t border-green-200/40 flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-[10px] font-bold text-emerald-700/60 uppercase tracking-widest">
                                <CheckCircle2 size={12} />
                                <span>Verified</span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600/40">Latest Update</span>
                        </div>
                        </CardContent>
                    </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Update Task Modal */}
        {selectedTask && (
            <UpdateTaskModal 
                isOpen={!!selectedTask} 
                onClose={() => setSelectedTask(null)} 
                task={selectedTask} 
                onUpdate={fetchData} 
            />
        )}

      </main>
    </>
  );
}
