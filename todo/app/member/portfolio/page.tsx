'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Link2, ExternalLink, CheckSquare, Clock, TrendingUp, Loader2, AlertCircle } from 'lucide-react';

export default function MemberPortfolioPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [githubError, setGithubError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const [profileRes, tasksRes] = await Promise.all([
          fetch(`${apiUrl}/api/auth/profile`, {
            headers: { 'Authorization': `Bearer ${token}` },
            credentials: 'include'
          }),
          fetch(`${apiUrl}/api/tasks/my`, {
            headers: { 'Authorization': `Bearer ${token}` },
            credentials: 'include'
          })
        ]);

        const profileData = await profileRes.json();
        const tasksData = await tasksRes.json();

        if (profileRes.ok) setUser(profileData);
        if (Array.isArray(tasksData)) setTasks(tasksData);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-10 h-10 text-[#003631] animate-spin" />
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.status === 'completed');
  const activeTasks = tasks.filter(t => t.status !== 'completed');
  const completionRate = tasks.length > 0
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  let githubUsername = user?.githubUsername?.trim();
  if (githubUsername) {
    githubUsername = githubUsername.replace(/\/$/, '');
    if (githubUsername.includes('/')) {
      githubUsername = githubUsername.split('/').pop();
    }
  }

  return (
    <>
      <Header title="My Portfolio" />
      <main className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">

        {/* Hero Banner */}
        <div className="bg-[#003631] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute left-1/2 bottom-0 w-64 h-64 bg-[#FFEDA8] rounded-full blur-3xl opacity-5 translate-y-1/2 pointer-events-none" />

          <div className="relative z-10 flex items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl border-2 border-white/20 shadow-lg bg-[#FFEDA8]/20 overflow-hidden flex items-center justify-center font-bold text-[#FFEDA8] text-3xl flex-shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
              ) : (
                user?.name?.charAt(0)
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black mb-1">{user?.name}'s Portfolio</h1>
              <p className="text-[#FFEDA8] font-bold text-sm uppercase tracking-widest">
                {user?.designation || user?.role}
              </p>
              {githubUsername && (
                <a
                  href={`https://github.com/${githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  github.com/{githubUsername}
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="relative z-10 flex gap-8 text-center flex-shrink-0">
            <div>
              <p className="text-4xl font-black text-[#FFEDA8]">{completedTasks.length}</p>
              <p className="text-xs uppercase tracking-widest text-white/60 mt-1">Tasks Done</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-4xl font-black text-[#FFEDA8]">{completionRate}%</p>
              <p className="text-xs uppercase tracking-widest text-white/60 mt-1">Efficiency</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-4xl font-black text-[#FFEDA8]">{activeTasks.length}</p>
              <p className="text-xs uppercase tracking-widest text-white/60 mt-1">Active</p>
            </div>
          </div>
        </div>

        {/* GitHub Contribution Graph */}
        {githubUsername ? (
          <Card className="border-none shadow-xl shadow-gray-200/40 rounded-[2.5rem] bg-white overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#003631]/5 flex items-center justify-center">
                    <Link2 className="w-5 h-5 text-[#003631]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-[#003631]">GitHub Contributions</h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">@{githubUsername}</p>
                  </div>
                </div>
                <a
                  href={`https://github.com/${githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold text-[#003631] hover:text-emerald-600 transition-colors"
                >
                  View on GitHub <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Contribution Calendar - ghchart.rshah.org */}
              {!githubError ? (
                <div className="w-full overflow-x-auto rounded-2xl bg-[#f8fafc] p-4">
                  <img
                    src={`https://ghchart.rshah.org/003631/${githubUsername}`}
                    alt={`${githubUsername}'s GitHub contribution chart`}
                    className="w-full min-w-[600px]"
                    onError={() => setGithubError(true)}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-gray-50/50 rounded-2xl gap-3">
                  <AlertCircle className="w-10 h-10 text-gray-300" />
                  <p className="text-sm font-bold text-gray-400">Could not load contribution chart</p>
                  <p className="text-xs text-gray-400">Make sure GitHub username <span className="font-black text-[#003631]">@{githubUsername}</span> is correct</p>
                </div>
              )}

              {/* GitHub Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                {[
                  {
                    label: 'Contribution Chart',
                    src: `https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=default&hide_border=true&title_color=003631&icon_color=003631&text_color=374151&bg_color=f8fafc`,
                    className: 'sm:col-span-2'
                  },
                  {
                    label: 'Top Languages',
                    src: `https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&layout=compact&hide_border=true&title_color=003631&text_color=374151&bg_color=f8fafc`,
                    className: 'sm:col-span-1'
                  }
                ].map((item, i) => (
                  <div key={i} className={`${item.className} bg-[#f8fafc] rounded-2xl p-3 overflow-hidden`}>
                    <img
                      src={item.src}
                      alt={item.label}
                      className="w-full h-auto"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          /* No GitHub Username - Prompt to add */
          <Card className="border-none shadow-xl shadow-gray-200/40 rounded-[2.5rem] bg-white overflow-hidden border-dashed">
            <CardContent className="p-10 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#003631]/5 flex items-center justify-center">
                <Link2 className="w-8 h-8 text-[#003631]/40" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#003631] mb-1">Link Your GitHub</h3>
                <p className="text-sm text-gray-400 max-w-sm">
                  Add your GitHub username in your profile settings to display your contribution activity here.
                </p>
              </div>
              <button
                onClick={() => router.push('/profile')}
                className="mt-2 px-8 py-3 bg-[#003631] text-white text-sm font-bold rounded-2xl hover:bg-[#003631]/90 transition-all"
              >
                Go to Profile Settings →
              </button>
            </CardContent>
          </Card>
        )}

        {/* Task Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Completed Tasks', value: completedTasks.length, icon: CheckSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Active Tasks', value: activeTasks.length, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: 'Completion Rate', value: `${completionRate}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="border-none shadow-xl shadow-gray-200/40 rounded-[2rem] bg-white group hover:scale-[1.02] transition-all">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:rotate-6 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    <h3 className="text-2xl font-black text-white">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Completed Tasks List */}
        {completedTasks.length > 0 && (
          <Card className="border-none shadow-xl shadow-gray-200/40 rounded-[2.5rem] bg-white overflow-hidden">
            <CardContent className="p-8">
              <h2 className="text-xl font-black text-[#003631] mb-6">Completed Work</h2>
              <div className="space-y-3">
                {completedTasks.map(task => (
                  <div key={task._id} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-emerald-100 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-black text-[#003631] text-sm group-hover:text-emerald-700 transition-colors">{task.title}</p>
                        <p className="text-[11px] text-gray-400 truncate max-w-xs mt-0.5">{task.description}</p>
                      </div>
                    </div>
                    <Badge variant="success">Completed</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </main>
    </>
  );
}
