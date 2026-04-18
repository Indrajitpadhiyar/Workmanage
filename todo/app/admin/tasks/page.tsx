'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Filter, Search, MoreVertical, Loader2, Edit2, Trash2 } from 'lucide-react';
import { AddTaskModal } from '@/components/AddTaskModal';
import { EditTaskModal } from '@/components/EditTaskModal';

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      // Fetch tasks
      const tasksRes = await fetch(`${apiUrl}/api/tasks/all`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      const tasksData = await tasksRes.json();
      
      // Fetch users
      const usersRes = await fetch(`${apiUrl}/api/auth/users`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      const usersData = await usersRes.json();

      if (Array.isArray(tasksData)) setTasks(tasksData);
      if (Array.isArray(usersData)) setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header title="Task Management" />
      <main className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full xl:w-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2.5 w-full bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FFEDA8] focus:border-[#003631] transition-all"
              />
            </div>
            <Button variant="outline" className="flex items-center justify-center space-x-2 py-2.5 rounded-xl border-gray-200">
              <Filter className="w-4 h-4" />
              <span className="font-bold text-xs uppercase tracking-widest">Filters</span>
            </Button>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center space-x-2 w-full xl:w-auto bg-[#003631] hover:bg-[#003631]/90 text-white py-6 rounded-2xl shadow-lg shadow-[#003631]/20"
          >
            <Plus className="w-4 h-4" />
            <span className="font-bold text-xs uppercase tracking-widest">Create Task</span>
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-[#003631] animate-spin" />
            <p className="text-gray-500 font-medium">Loading tasks...</p>
          </div>
        ) : (
          <Card className="border-none shadow-sm shadow-gray-200/50 overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 bg-gray-50 uppercase tracking-wider">
                    <tr>
                    <th className="px-6 py-4 font-semibold">Details</th>
                    <th className="px-6 py-4 font-semibold">Assignee</th>
                    <th className="px-6 py-4 font-semibold">Latest Update</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Created</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No tasks found. Create one to get started!
                      </td>
                    </tr>
                  ) : (
                    filteredTasks.map(task => (
                      <tr key={task._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#003631] mb-0.5 whitespace-nowrap">{task.title}</p>
                          <p className="text-xs text-gray-400 line-clamp-1 truncate w-40">{task.description}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 rounded-full bg-[#003631]/10 text-[#003631] flex items-center justify-center text-[10px] font-bold border border-[#003631]/5">
                              {task.assignee?.name?.charAt(0) || '?'}
                            </div>
                            <span className="font-medium text-gray-700 whitespace-nowrap">{task.assignee?.name || 'Unassigned'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 w-60">
                          {task.remarks ? (
                              <p className="text-xs italic text-emerald-700 bg-emerald-50 rounded-lg p-2 border border-emerald-100 line-clamp-2">
                                "{task.remarks}"
                              </p>
                          ) : (
                              <span className="text-gray-300 text-[10px] uppercase font-bold tracking-tighter">No update yet</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={task.status === "completed" ? "success" : task.status === "in-progress" ? "default" : "warning"}>
                            {task.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                          {new Date(task.createdAt || Date.now()).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                                onClick={() => { setSelectedTask(task); setIsEditModalOpen(true); }}
                                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button 
                                onClick={() => handleDelete(task._id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Modals */}
        <AddTaskModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          users={users.filter(u => u.role === 'member')} 
          onTaskAdded={fetchData}
        />

        {selectedTask && (
            <EditTaskModal 
                isOpen={isEditModalOpen}
                onClose={() => { setIsEditModalOpen(false); setSelectedTask(null); }}
                users={users.filter(u => u.role === 'member')}
                task={selectedTask}
                onTaskUpdated={fetchData}
            />
        )}

      </main>
    </>
  );
}
