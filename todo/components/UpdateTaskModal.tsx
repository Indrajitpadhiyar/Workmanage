'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: string;
    remarks?: string;
}

interface UpdateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task;
    onUpdate: () => void;
}

export const UpdateTaskModal: React.FC<UpdateTaskModalProps> = ({ isOpen, onClose, task, onUpdate }) => {
    const [status, setStatus] = useState(task.status);
    const [remarks, setRemarks] = useState(task.remarks || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:8000/api/tasks/${task._id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status, remarks })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Task updated successfully!' });
                setTimeout(() => {
                    onUpdate();
                    onClose();
                }, 1500);
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update task' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-[#003631]/40 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 sm:p-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-extrabold text-[#003631]">Update Progress</h2>
                            <p className="text-gray-500 text-sm mt-1">{task.title}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {/* Status */}
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-gray-700 ml-1">Current Status</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['pending', 'in-progress', 'completed'].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setStatus(s)}
                                            className={`py-3 px-2 rounded-2xl text-[10px] uppercase font-bold tracking-wider transition-all border-2 ${
                                                status === s 
                                                ? 'bg-[#003631] text-white border-[#003631] shadow-lg shadow-[#003631]/20' 
                                                : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-200'
                                            }`}
                                        >
                                            {s.replace('-', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Remarks */}
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-gray-700 ml-1">Update Note / Remark</label>
                                <textarea
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="Briefly explain your progress..."
                                    rows={4}
                                    className="block w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#003631]/10 focus:border-[#003631] outline-none transition-all text-sm resize-none"
                                />
                            </div>
                        </div>

                        {message.text && (
                            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium animate-in slide-in-from-top-2 ${
                                message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                            }`}>
                                {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                {message.text}
                            </div>
                        )}

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
                                disabled={loading || (status === task.status && remarks === (task.remarks || ''))}
                                className="flex-[2] bg-[#003631] text-white py-4 px-6 rounded-2xl font-bold shadow-xl hover:bg-[#003631]/90 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                {loading ? 'Updating...' : 'Submit Update'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
