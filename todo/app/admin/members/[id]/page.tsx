'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Mail, CheckSquare, Clock, AlertCircle, Loader2,
  User, Shield, Link2, ExternalLink, TrendingUp
} from 'lucide-react';

export default function AdminMemberProfilePage() {
  const params = useParams();
  // Next.js 16 mein params.id string ya string[] dono ho sakta hai
  const raw = params?.id;
  const memberId = Array.isArray(raw) ? raw[0] : (raw as string);

  const [member, setMember] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [githubError, setGithubError] = useState(false);

  useEffect(() => {
    if (!memberId) return;

    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const [memberRes, tasksRes] = await Promise.all([
          fetch(`${apiUrl}/api/auth/users/${memberId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            credentials: 'include'
          }),
          fetch(`${apiUrl}/api/tasks/all`, {
            headers: { 'Authorization': `Bearer ${token}` },
            credentials: 'include'
          })
        ]);

        const memberData = await memberRes.json();
        const tasksData = await tasksRes.json();

        if (memberRes.ok) setMember(memberData);
        if (Array.isArray(tasksData)) {
          // Is member ke tasks filter — assignee._id ya direct assignee string match
          setTasks(
            tasksData.filter(
              (t: any) => t.assignee?._id === memberId || t.assignee === memberId
            )
          );
        }
      } catch (error) {
        console.error('Error fetching member profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [memberId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-10 h-10 text-[#003631] animate-spin" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] gap-4">
        <User className="w-16 h-16 text-gray-200" />
        <p className="text-gray-400 font-bold">Member not found</p>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.status === 'completed');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completionRate =
    tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  let githubUsername = member.githubUsername?.trim();
  if (githubUsername) {
    githubUsername = githubUsername.replace(/\/$/, '');
    if (githubUsername.includes('/')) {
      githubUsername = githubUsername.split('/').pop();
    }
  }

  return (
    <>
      <Header title={`${member.name}'s Profile`} showBack={true} />
      <main className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-500">

        {/* ── Profile Header Card ── */}
        <Card className="border-none shadow-xl shadow-gray-200/40 overflow-hidden rounded-[2.5rem] bg-white">
          <div className="h-28 bg-[#003631]" />
          <CardContent className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-14">

              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-[#FFEDA8]/30 overflow-hidden flex items-center justify-center font-bold text-[#003631] text-4xl flex-shrink-0">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    className="w-full h-full object-cover"
                    alt={member.name}
                  />
                ) : (
                  <span>{member.name?.charAt(0)?.toUpperCase()}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 pb-2">
                <h2 className="text-2xl font-black text-[#003631]">{member.name}</h2>
                <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider mt-1">
                  {member.designation || member.role}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{member.email}</span>
                  </div>
                  {githubUsername && (
                    <a
                      href={`https://github.com/${githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#003631] transition-colors"
                    >
                      <Link2 className="w-4 h-4 text-gray-400" />
                      <span>@{githubUsername}</span>
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                  )}
                </div>
              </div>

              {/* Role Badge */}
              <div className="pb-2">
                <span className="flex items-center gap-1.5 px-4 py-2 bg-[#003631]/5 rounded-xl text-xs font-black uppercase tracking-widest text-[#003631]">
                  <Shield className="w-3.5 h-3.5" />
                  {member.role}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Tasks', value: tasks.length, icon: CheckSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Completed', value: completedTasks.length, icon: CheckSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'In Progress', value: inProgressTasks.length, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: 'Efficiency', value: `${completionRate}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card
                key={i}
                className="border-none shadow-xl shadow-gray-200/40 rounded-[2rem] bg-white group hover:scale-[1.02] transition-all"
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:rotate-6 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    <h3 className="text-2xl font-black text-[#003631]">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ── GitHub Contribution Graph ── */}
        {githubUsername ? (
          <Card className="border-none shadow-xl shadow-gray-200/40 rounded-[2.5rem] bg-white overflow-hidden">
            <CardContent className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#003631]/5 flex items-center justify-center">
                    <Link2 className="w-5 h-5 text-[#003631]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-[#003631]">GitHub Contributions</h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                      @{githubUsername}
                    </p>
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

              {/* Contribution Calendar */}
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
                  <p className="text-sm font-bold text-gray-400">
                    Could not load chart — check GitHub username
                  </p>
                </div>
              )}

              {/* GitHub Stats + Top Languages */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="sm:col-span-2 bg-[#f8fafc] rounded-2xl p-3 overflow-hidden">
                  <img
                    src={`https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&hide_border=true&title_color=003631&icon_color=003631&text_color=374151&bg_color=f8fafc`}
                    alt="GitHub Stats"
                    className="w-full h-auto"
                  />
                </div>
                <div className="sm:col-span-1 bg-[#f8fafc] rounded-2xl p-3 overflow-hidden">
                  <img
                    src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&layout=compact&hide_border=true&title_color=003631&text_color=374151&bg_color=f8fafc`}
                    alt="Top Languages"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* No GitHub username set */
          <Card className="border-none shadow-xl shadow-gray-200/40 rounded-[2.5rem] bg-white overflow-hidden">
            <CardContent className="p-10 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#003631]/5 flex items-center justify-center">
                <Link2 className="w-7 h-7 text-[#003631]/30" />
              </div>
              <p className="text-sm font-bold text-gray-400">
                No GitHub username linked for this member.
              </p>
            </CardContent>
          </Card>
        )}

        {/* ── Assigned Tasks ── */}
        <Card className="border-none shadow-xl shadow-gray-200/40 rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="px-8 pt-8 pb-4">
            <CardTitle className="text-xl font-black text-[#003631]">Assigned Tasks</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-6">
            {tasks.length === 0 ? (
              <div className="text-center py-16">
                <CheckSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 italic text-sm">No tasks assigned yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Task Title</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {tasks.map(task => (
                      <tr
                        key={task._id}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <p className="font-black text-[#003631] mb-1 group-hover:text-emerald-700 transition-colors">
                            {task.title}
                          </p>
                          <p className="text-[11px] text-gray-400 line-clamp-1 truncate max-w-xs">
                            {task.description}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-center">
                            <Badge
                              variant={
                                task.status === 'completed' ? 'success' :
                                  task.status === 'in-progress' ? 'default' : 'warning'
                              }
                            >
                              {task.status}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className="text-[11px] font-black text-gray-400 uppercase tracking-tighter">
                            {new Date(task.createdAt || Date.now()).toLocaleDateString('en-GB', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

      </main>
    </>
  );
}
