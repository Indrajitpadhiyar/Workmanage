'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface Task {
    _id: string;
    title: string;
    description: string;
    assignee?: {
        _id: string;
        name: string;
    };
    status: string;
}

interface EditTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    users: User[];
    task: Task;
    onTaskUpdated: () => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, onClose, users, task, onTaskUpdated }) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [assignee, setAssignee] = useState(task.assignee?._id || '');
    const [status, setStatus] = useState(task.status);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setAssignee(task.assignee?._id || '');
            setStatus(task.status);
        }
    }, [task]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        const token = localStorage.getItem('token');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/api/tasks/${task._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify({ title, description, assignee, status })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to update task');
            }

            setSuccess(true);
            setTimeout(() => {
                onTaskUpdated();
                onClose();
            }, 1000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-[#003631]/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 border border-gray-100">
                <div className="p-8 sm:p-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-[#003631]">Edit Task</h2>
                            <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold text-[10px]">Update task details or assignment</p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {/* Title */}
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-black text-gray-500 uppercase tracking-widest ml-1">Task Title</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="block w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm font-semibold"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="block w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm font-semibold resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Status */}
                                <div className="space-y-1.5">
                                    <label className="text-[12px] font-black text-gray-500 uppercase tracking-widest ml-1">Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="block w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm font-semibold appearance-none cursor-pointer"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>

                                {/* Assignee */}
                                <div className="space-y-1.5">
                                    <label className="text-[12px] font-black text-gray-500 uppercase tracking-widest ml-1">Assignee</label>
                                    <select
                                        value={assignee}
                                        onChange={(e) => setAssignee(e.target.value)}
                                        className="block w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm font-semibold appearance-none cursor-pointer"
                                    >
                                        <option value="">Unassigned</option>
                                        {users.map((user) => (
                                            <option key={user._id} value={user._id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Status Messages */}
                        {error && (
                            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl text-[11px] font-black uppercase tracking-widest animate-in slide-in-from-top-1">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-[11px] font-black uppercase tracking-widest animate-in slide-in-from-top-1">
                                <CheckCircle2 size={16} />
                                Task updated successfully!
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 px-6 border border-gray-100 rounded-2xl text-gray-500 font-black uppercase tracking-widest text-[11px] hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || success}
                                className="flex-[2] bg-[#003631] text-white py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-emerald-900/20 hover:bg-[#003631]/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}
                                {!loading && !success && <Save size={16} />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
