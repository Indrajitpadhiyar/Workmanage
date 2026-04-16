'use client';

import React, { useState } from 'react';
import { X, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    users: User[];
    onTaskAdded: () => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, users, onTaskAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignee, setAssignee] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication required. Please login again.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:8000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, description, assignee })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to create task');
            }

            setSuccess(true);
            setTimeout(() => {
                onTaskAdded();
                onClose();
                resetForm();
            }, 1500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setAssignee('');
        setError('');
        setSuccess(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-[#003631]/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 border border-gray-100">
                <div className="p-8 sm:p-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-extrabold text-[#003631]">Create New Task</h2>
                            <p className="text-gray-500 text-sm mt-1">Assign a new task to your team member</p>
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
                                <label className="text-[13px] font-semibold text-gray-700 ml-1">Task Title</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#003631]/10 focus:border-[#003631] outline-none transition-all text-sm"
                                    placeholder="e.g., Update Landing Page"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-semibold text-gray-700 ml-1">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#003631]/10 focus:border-[#003631] outline-none transition-all text-sm resize-none"
                                    placeholder="Describe the task details..."
                                />
                            </div>

                            {/* Assignee */}
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-semibold text-gray-700 ml-1">Assign To</label>
                                <select
                                    required
                                    value={assignee}
                                    onChange={(e) => setAssignee(e.target.value)}
                                    className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#003631]/10 focus:border-[#003631] outline-none transition-all text-sm appearance-none cursor-pointer"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                                >
                                    <option value="">Select a team member</option>
                                    {users.map((user) => (
                                        <option key={user._id} value={user._id}>
                                            {user.name} ({user.role})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Status Messages */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium animate-in slide-in-from-top-1">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-medium animate-in slide-in-from-top-1">
                                <CheckCircle2 size={16} />
                                Task created and assigned successfully!
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 px-6 border border-gray-200 rounded-2xl text-gray-600 font-bold hover:bg-gray-50 transition-all text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || success}
                                className="flex-[2] bg-[#003631] text-white py-4 px-6 rounded-2xl font-bold shadow-xl hover:bg-[#003631]/90 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating...' : success ? 'Added!' : 'Create Task'}
                                {!loading && !success && <Plus size={18} />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
