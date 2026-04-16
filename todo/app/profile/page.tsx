'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Camera, User, Mail, Shield, Loader2, CheckCircle2, AlertCircle, Link2, MonitorSmartphone } from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({ name: '', email: '', designation: '', githubUsername: '' });
    const [preview, setPreview] = useState<string | null>(null);

    // PWA Install State
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const res = await fetch('http://localhost:8000/api/auth/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
                setFormData({ name: data.name, email: data.email, designation: data.designation || '', githubUsername: data.githubUsername || '' });
                setPreview(data.avatar);
            } else {
                router.push('/login');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();

        // PWA Setup
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW logic error', err));
        }

        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            setIsInstallable(false);
        }
        setDeferredPrompt(null);
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        setMessage({ type: '', text: '' });

        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:8000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)  // includes githubUsername
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                // Update local storage user info
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({ ...storedUser, ...data.user }));
                // Trigger header update
                window.dispatchEvent(new Event('userProfileUpdated'));
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setUpdating(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);

        setUploading(true);
        setMessage({ type: '', text: '' });

        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const res = await fetch('http://localhost:8000/api/auth/profile/avatar', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                setUser({ ...user, avatar: data.avatar });
                setMessage({ type: 'success', text: 'Profile picture updated!' });
                // Update local storage user info
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({ ...storedUser, avatar: data.avatar }));
                // Trigger header update
                window.dispatchEvent(new Event('userProfileUpdated'));
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            console.error('Upload error:', error);
            setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to upload image' });
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <Loader2 className="w-10 h-10 text-[#003631] animate-spin" />
            </div>
        );
    }

    return (
        <>
            <Header title="My Profile" showBack={true} />
            <main className="p-8 max-w-4xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Avatar Section */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="p-8 flex flex-col items-center text-center bg-white shadow-xl shadow-gray-200/50 rounded-[2rem] border-none relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-24 bg-[#003631]"></div>
                            
                            <div className="relative mt-8">
                                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-100 overflow-hidden relative">
                                    {preview ? (
                                        <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#003631] bg-[#FFEDA8]/30 font-bold text-4xl">
                                            {user?.name?.charAt(0)}
                                        </div>
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 p-2.5 bg-[#FFEDA8] text-[#003631] rounded-full shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-all">
                                    <Camera size={20} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                                </label>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-xl font-bold text-[#003631]">{user?.name}</h3>
                                <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1 capitalize">
                                    <Shield size={14} className="text-[#003631]" />
                                    {user?.designation || user?.role}
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Edit Form Section */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="p-10 bg-white shadow-xl shadow-gray-200/50 rounded-[2rem] border-none">
                            <h2 className="text-2xl font-extrabold text-[#003631] mb-8">Account Settings</h2>

                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-gray-700 ml-1">Full Name</label>
                                    <div className="relative transition-all">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="block w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#003631]/10 focus:border-[#003631] outline-none transition-all text-sm"
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-gray-700 ml-1">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="block w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#003631]/10 focus:border-[#003631] outline-none transition-all text-sm"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-gray-700 ml-1">GitHub Username</label>
                                    <div className="relative transition-all">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                            <Link2 size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.githubUsername}
                                            onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
                                            className="block w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#003631]/10 focus:border-[#003631] outline-none transition-all text-sm"
                                            placeholder="e.g. Indrajitpadhiyar"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-gray-700 ml-1">Designation / Job Title</label>
                                    <div className="relative transition-all">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                            <Shield size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.designation}
                                            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                            className="block w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#003631]/10 focus:border-[#003631] outline-none transition-all text-sm"
                                            placeholder="e.g. Frontend Engineer"
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

                                <div className="pt-4">
                                    <Button 
                                        type="submit" 
                                        disabled={updating}
                                        className="w-full sm:w-auto px-10 py-4 bg-[#003631] hover:bg-[#003631]/90 text-white font-bold rounded-2xl shadow-xl transition-all"
                                    >
                                        {updating ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin mr-2" />
                                                Saving Changes...
                                            </>
                                        ) : (
                                            'Save Profile'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Card>

                        {/* PWA Settings */}
                        <Card className="p-10 bg-white shadow-xl shadow-gray-200/50 rounded-[2rem] border-none">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-extrabold text-[#003631] mb-2 flex items-center gap-2">
                                        <MonitorSmartphone className="w-5 h-5" /> App Preferences
                                    </h2>
                                    <p className="text-sm text-gray-500 max-w-sm">
                                        Install this application on your device's home screen for quicker access and a native app-like experience.
                                    </p>
                                </div>
                                <div>
                                    <Button 
                                        onClick={handleInstallClick}
                                        disabled={!isInstallable}
                                        className={`px-6 py-4 font-bold rounded-2xl shadow-md transition-all ${
                                            isInstallable 
                                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed hidden sm:flex'
                                        }`}
                                    >
                                        {isInstallable ? 'Add to Home Screen' : 'Already Installed / Not Supported'}
                                    </Button>
                                    {!isInstallable && (
                                        <span className="sm:hidden text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                                            Installed
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </>
    );
}
