import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/ui/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { UploadCloud, Paperclip, CheckCircle, Loader2 } from 'lucide-react';
import { tasks as mockTasks } from '@/lib/data';
import { API_URL } from '@/lib/api-config';

export default function MemberTaskDetailPage() {
  const { id } = useParams();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      const token = localStorage.getItem('token');
      try {
        // Try to fetch from API if available, otherwise fallback to mock data
        const res = await fetch(`${API_URL}/api/tasks/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include'
        });
        
        if (res.ok) {
          const data = await res.json();
          setTask(data);
        } else {
          // Fallback to mock data if API fails or is not implemented for single task
          const mockTask = mockTasks.find((t: any) => t.id === id) || mockTasks[0];
          setTask(mockTask);
        }
      } catch (error) {
        console.error('Error fetching task details:', error);
        const mockTask = mockTasks.find((t: any) => t.id === id) || mockTasks[0];
        setTask(mockTask);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-10 h-10 text-[#003631] animate-spin" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <p className="text-gray-500 font-bold">Task not found</p>
      </div>
    );
  }

  return (
    <>
      <Header title="Task Details" showBack={true} />
      <main className="p-8 max-w-5xl mx-auto w-full space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div>
             <div className="flex items-center gap-3 mb-2">
               <Badge variant="outline">{task.projectId || 'Task'}</Badge>
               <Badge variant={task.status === "completed" ? "success" : task.status === "in-progress" ? "default" : "warning"}>{task.status}</Badge>
               <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded">Due: {task.dueDate || 'N/A'}</span>
             </div>
             <h1 className="text-2xl font-bold text-[#003631]">{task.title}</h1>
           </div>
           <div className="flex space-x-3 w-full md:w-auto">
              <Button variant="outline" className="flex-1 md:flex-none">Mark In Progress</Button>
              <Button className="flex-1 md:flex-none">Submit Work</Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
             <Card className="border-none shadow-sm shadow-gray-200/50">
               <CardHeader>
                 <CardTitle>Task Description</CardTitle>
               </CardHeader>
               <CardContent className="prose prose-sm max-w-none text-gray-600">
                 <p>{task.description}</p>
                 
                 <h4 className="text-[#003631] mt-6 font-semibold">Acceptance Criteria</h4>
                 <ul className="list-disc pl-5 space-y-1">
                   <li>User must be able to log in with Google</li>
                   <li>User must be able to log in with Email/Password</li>
                   <li>Session token must be HTTP-only</li>
                   <li>Token expiration handled smoothly on the frontend</li>
                 </ul>
               </CardContent>
             </Card>

             <Card className="border-none shadow-sm shadow-gray-200/50 border border-[#003631]/10 bg-[#f8fafc]">
               <CardHeader>
                 <CardTitle className="text-xl">Submit Completion Proof</CardTitle>
                 <CardDescription>Upload files, screenshots, or provide links related to your work.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                 
                 <div>
                   <label className="block text-sm font-semibold text-[#003631] mb-2">Completion Note / Summary</label>
                   <textarea 
                     className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#003631]"
                     rows={4}
                     placeholder="Describe what was done, any challenges faced, and instructions for reviewers..."
                   ></textarea>
                 </div>

                 <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-white flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#003631] transition-colors">
                   <div className="w-12 h-12 bg-[#FFEDA8] rounded-full flex items-center justify-center mb-4">
                     <UploadCloud className="w-6 h-6 text-[#003631]" />
                   </div>
                   <h4 className="font-semibold text-[#003631] mb-1">Click to upload or drag and drop</h4>
                   <p className="text-xs text-gray-500">SVG, PNG, JPG, ZIP or PDF (max. 10MB)</p>
                 </div>

                 <Button className="w-full h-12 text-md shadow-lg shadow-[#003631]/20">
                   <CheckCircle className="w-5 h-5 mr-2" />
                   Submit for Review
                 </Button>

               </CardContent>
             </Card>
          </div>

          <div className="space-y-6">
             <Card className="border-none shadow-sm shadow-gray-200/50">
               <CardHeader>
                 <CardTitle>Details</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="flex justify-between border-b border-gray-100 pb-3">
                   <span className="text-gray-500 text-sm">Assigned By</span>
                   <span className="font-semibold text-[#003631] text-sm">{task.assignedBy || 'Admin'}</span>
                 </div>
                 <div className="flex justify-between border-b border-gray-100 pb-3">
                   <span className="text-gray-500 text-sm">Assigned Date</span>
                   <span className="font-semibold text-[#003631] text-sm">{task.assignedDate || new Date(task.createdAt).toLocaleDateString()}</span>
                 </div>
                 <div className="flex justify-between border-b border-gray-100 pb-3">
                   <span className="text-gray-500 text-sm">Priority</span>
                   <span className={`text-sm font-bold ${task.priority === 'High' ? 'text-red-500' : 'text-orange-500'}`}>{task.priority || 'Medium'}</span>
                 </div>
               </CardContent>
             </Card>

             <Card className="border-none shadow-sm shadow-gray-200/50 bg-[#FFEDA8]/30">
               <CardHeader>
                 <CardTitle className="text-md flex items-center">
                   <Paperclip className="w-4 h-4 mr-2" /> Attachments ({task.attachments || 0})
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                 <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200/50 cursor-pointer hover:shadow-sm">
                   <div className="flex items-center space-x-3">
                     <div className="w-8 h-8 rounded bg-red-100 text-red-500 flex items-center justify-center font-bold text-xs">PDF</div>
                     <div>
                       <p className="text-sm font-semibold text-[#003631] leading-tight">Mockups_v2.pdf</p>
                       <p className="text-[10px] text-gray-500">2.4 MB</p>
                     </div>
                   </div>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200/50 cursor-pointer hover:shadow-sm">
                   <div className="flex items-center space-x-3">
                     <div className="w-8 h-8 rounded bg-blue-100 text-blue-500 flex items-center justify-center font-bold text-xs">DOC</div>
                     <div>
                       <p className="text-sm font-semibold text-[#003631] leading-tight">API_Specs.docx</p>
                       <p className="text-[10px] text-gray-500">1.1 MB</p>
                     </div>
                   </div>
                 </div>
               </CardContent>
             </Card>
          </div>

        </div>

      </main>
    </>
  );
}
