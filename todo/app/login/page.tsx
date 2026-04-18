'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, LogIn } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Save token and user info (simple localStorage for demo)
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            if (data.user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/member');
            }
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
                        
                        <h1 className="text-3xl font-extrabold text-[#003631] mb-2">Welcome Back</h1>
                        <p className="text-gray-500 mb-8 text-sm">Sign in to your dashboard</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                {/* Email Input */}
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-semibold text-gray-700 ml-1">Email Address</label>
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
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-[13px] font-semibold text-gray-700">Password</label>
                                        <button type="button" className="text-xs text-gray-400 hover:text-[#003631] transition-colors">
                                            Forgot password?
                                        </button>
                                    </div>
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
                            </div>

                            {error && <div className="text-red-500 text-xs text-center font-medium bg-red-50 py-2 rounded-lg">{error}</div>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#003631] text-white rounded-2xl py-4 font-bold shadow-xl hover:bg-[#003631]/90 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                                {!loading && <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>

                        <p className="text-center mt-8 text-sm text-gray-500">
                            New here?{' '}
                            <Link href="/register" className="text-[#003631] font-bold hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
