'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Search, Filter, Clock, CheckCircle2, PlayCircle, AlertTriangle, ArrowRight, Loader2, ListFilter } from 'lucide-react';
import { UpdateTaskModal } from '@/components/UpdateTaskModal';

export default function MemberTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/tasks/my`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-10 h-10 text-[#003631] animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Header title="My Tasks" />
      <main className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Top Controls */}
        <div className="flex flex-col xl:flex-row gap-4 items-center justify-between bg-white p-4 sm:p-6 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-50">
          <div className="relative w-full lg:max-w-md">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by title or description..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FFEDA8] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full xl:w-auto pb-4 xl:pb-0 no-scrollbar">
            <button 
              onClick={() => setFilterStatus('all')}
              className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                filterStatus === 'all' ? 'bg-[#003631] text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              All Tasks
            </button>
            <button 
              onClick={() => setFilterStatus('pending')}
              className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                filterStatus === 'pending' ? 'bg-orange-500 text-white shadow-lg' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
              }`}
            >
              <AlertTriangle size={14} />
              Pending
            </button>
            <button 
              onClick={() => setFilterStatus('in-progress')}
              className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                filterStatus === 'in-progress' ? 'bg-blue-500 text-white shadow-lg' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              <PlayCircle size={14} />
              In Progress
            </button>
            <button 
              onClick={() => setFilterStatus('completed')}
              className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                filterStatus === 'completed' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 size={14} />
              Completed
            </button>
          </div>
        </div>

        {/* Task Grid/List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ListFilter size={32} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-extrabold text-[#003631]">No tasks found</h3>
                <p className="text-gray-400 max-w-xs mx-auto mt-2 italic">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <Card key={task._id} className="border-none shadow-xl shadow-gray-200/30 hover:shadow-2xl transition-all rounded-[2.5rem] bg-white group overflow-hidden border border-gray-50/50">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Status Indicator Bar */}
                    <div className={`w-2 lg:w-3 ${
                      task.status === "completed" ? "bg-emerald-500" : 
                      task.status === "in-progress" ? "bg-blue-500" : "bg-orange-500"
                    }`}></div>
                    
                    <div className="flex-1 p-6 sm:p-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                       <div className="space-y-4 max-w-2xl">
                          <div className="flex items-center gap-3">
                             <Badge variant={task.status === "completed" ? "success" : task.status === "in-progress" ? "default" : "warning"}>
                               {task.status}
                             </Badge>
                             <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                <Clock size={14} />
                                Assigned on {new Date(task.createdAt).toLocaleDateString()}
                             </div>
                          </div>
                          
                          <div className="space-y-2">
                             <h3 className="text-2xl font-black text-[#003631] tracking-tight group-hover:text-emerald-700 transition-colors uppercase">{task.title}</h3>
                             <p className="text-sm text-gray-500 leading-relaxed font-medium">{task.description}</p>
                          </div>

                          {task.remarks && (
                            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 mt-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Latest Progress Remark</p>
                                <p className="text-xs text-gray-600 font-medium italic">"{task.remarks}"</p>
                            </div>
                          )}
                       </div>

                       <div className="flex flex-col items-stretch lg:items-end gap-4 w-full lg:w-auto shrink-0">
                          <div className="flex lg:flex-col gap-2">
                              <Button 
                                onClick={() => setSelectedTask(task)}
                                className="flex-1 lg:w-48 py-4 bg-[#003631] text-white hover:bg-[#003631]/90 rounded-2xl font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 group/btn"
                              >
                                {task.status === 'completed' ? 'View Details' : 'Update Status'}
                                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                              </Button>
                          </div>
                       </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Update Task Modal */}
        {selectedTask && (
            <UpdateTaskModal 
                isOpen={!!selectedTask} 
                onClose={() => setSelectedTask(null)} 
                task={selectedTask} 
                onUpdate={fetchTasks} 
            />
        )}
      </main>
    </>
  );
}
