'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Key, ArrowRight, ShieldCheck, UserCircle } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'member',
        designation: '',
        adminKey: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('http://localhost:8000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => router.push('/login'), 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFEDA8]/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#003631]/5 rounded-full -ml-16 -mb-16 blur-2xl"></div>

                    <div className="relative">
                        <div className="w-16 h-16 bg-[#003631] text-[#FFEDA8] rounded-2xl flex items-center justify-center text-3xl font-bold mb-8 shadow-lg">
                            T
                        </div>
                        
                        <h1 className="text-3xl font-extrabold text-[#003631] mb-2">Create Account</h1>
                        <p className="text-gray-500 mb-8 text-sm">Join our company task management system</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-4">
                                {/* Name Input */}
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-semibold text-gray-700 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#003631] transition-colors">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#003631]/10 focus:border-[#003631] outline-none transition-all text-sm"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                {/* Email Input */}
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-semibold text-gray-700 ml-1">Work Email</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#003631] transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#003631]/10 focus:border-[#003631] outline-none transition-all text-sm"
                                            placeholder="john@company.com"
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-semibold text-gray-700 ml-1">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#003631] transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#003631]/10 focus:border-[#003631] outline-none transition-all text-sm"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                {/* Designation Input */}
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-semibold text-gray-700 ml-1">Job Title / Designation</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#003631] transition-colors">
                                            <ShieldCheck size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="designation"
                                            value={formData.designation}
                                            onChange={handleChange}
                                            className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#003631]/10 focus:border-[#003631] outline-none transition-all text-sm"
                                            placeholder="e.g. Frontend Engineer"
                                        />
                                    </div>
                                </div>

                                {/* Role Selector */}
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-semibold text-gray-700 ml-1">Select Role</label>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'member' })}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all text-sm font-medium ${
                                                formData.role === 'member'
                                                    ? 'bg-[#003631] border-[#003631] text-white shadow-md'
                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                        >
                                            <UserCircle size={16} />
                                            Member
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'admin' })}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all text-sm font-medium ${
                                                formData.role === 'admin'
                                                    ? 'bg-[#003631] border-[#003631] text-white shadow-md'
                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                        >
                                            <ShieldCheck size={16} />
                                            Admin
                                        </button>
                                    </div>
                                </div>

                                {/* Admin Secret Key - Conditional */}
                                {formData.role === 'admin' && (
                                    <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="text-[13px] font-semibold text-[#003631] ml-1">Special Admin Key</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#003631]/40 group-focus-within:text-[#003631] transition-colors">
                                                <Key size={18} />
                                            </div>
                                            <input
                                                type="password"
                                                name="adminKey"
                                                required={formData.role === 'admin'}
                                                value={formData.adminKey}
                                                onChange={handleChange}
                                                className="block w-full pl-11 pr-4 py-3.5 bg-[#FFEDA8]/10 border border-[#FFEDA8] rounded-2xl focus:ring-2 focus:ring-[#003631]/10 focus:border-[#003631] outline-none transition-all text-sm"
                                                placeholder="Enter Admin Key"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {error && <div className="text-red-500 text-xs mt-2 text-center font-medium bg-red-50 py-2 rounded-lg">{error}</div>}
                            {success && <div className="text-emerald-500 text-xs mt-2 text-center font-medium bg-emerald-50 py-2 rounded-lg">{success}</div>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#003631] text-white rounded-2xl py-4 font-bold shadow-xl hover:bg-[#003631]/90 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {loading ? 'Creating Account...' : 'Register'}
                                {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>

                        <p className="text-center mt-8 text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link href="/login" className="text-[#003631] font-bold hover:underline">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
