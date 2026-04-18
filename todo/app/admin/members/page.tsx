'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { API_URL } from '@/lib/api-config';

import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, Mail, Edit2, Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminMembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit Modal State
  const [editingMember, setEditingMember] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', role: '', designation: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchMembers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/auth/users`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        // Admin ki profile members list mein nahi dikhni chahiye
        setMembers(data.filter((u: any) => u.role !== 'admin'));
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleEditClick = (member: any) => {
    setEditingMember(member);
    setEditFormData({ name: member.name, email: member.email, role: member.role, designation: member.designation || '' });
    setMessage({ type: '', text: '' });
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setMessage({ type: '', text: '' });

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/auth/users/${editingMember._id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(editFormData)
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Member updated successfully!' });
        fetchMembers();
        setTimeout(() => setEditingMember(null), 1500);
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update member' });
    } finally {
      setEditLoading(false);
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header title="Team Directory" />
      <main className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Member Count Badge */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-500">Total Members:</span>
          <span className="px-3 py-1 bg-[#003631] text-white text-sm font-bold rounded-full">{filteredMembers.length}</span>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 sm:p-6 rounded-[2rem] sm:rounded-3xl shadow-sm border border-gray-100">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search team members..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-3 w-full bg-gray-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FFEDA8] transition-all"
            />
          </div>
          <Button className="w-full md:w-auto px-8 bg-[#003631] py-6 sm:py-4 rounded-xl sm:rounded-2xl">Add Member</Button>
        </div>

        {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#003631] animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Fetching team...</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredMembers.length === 0 ? (
                <div className="col-span-3 py-16 text-center">
                  <p className="text-gray-400 italic">No team members found.</p>
                </div>
            ) : filteredMembers.map(member => (
                <Card key={member._id} className="border-none shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:-translate-y-1 transition-all group overflow-hidden bg-white rounded-[2.5rem] cursor-pointer" onClick={() => router.push(`/admin/members/${member._id}`)}>
                <div className="h-24 bg-[#003631] relative">
                    <div className="absolute -bottom-10 left-8">
                        <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-gray-100 overflow-hidden flex items-center justify-center font-bold text-[#003631] text-2xl">
                            {member.avatar ? (
                                <img src={member.avatar} className="w-full h-full object-cover" alt={member.name} />
                            ) : (
                                member.name.charAt(0)
                            )}
                        </div>
                    </div>
                </div>
                <CardContent className="pt-12 pb-8 px-8">
                    <div className="mb-6">
                        <h3 className="text-xl font-extrabold text-[#003631] mb-1">{member.name}</h3>
                        <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 inline-block px-2 py-1 rounded-md">{member.designation || member.role}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-xs text-gray-500 mb-8 pb-6 border-b border-gray-100">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{member.email}</span>
                    </div>

                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            className="flex-1 text-xs font-bold rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700"
                            onClick={(e) => { e.stopPropagation(); handleEditClick(member); }}
                        >
                            <Edit2 className="w-3.5 h-3.5 mr-2" />
                            Edit Member
                        </Button>
                        <Button
                            className="flex-1 text-xs font-bold rounded-xl bg-[#003631] text-white"
                            onClick={(e) => { e.stopPropagation(); router.push(`/admin/members/${member._id}`); }}
                        >
                            View Profile
                        </Button>
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>
        )}

        {/* Edit Modal */}
        {editingMember && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditingMember(null)}></div>
                <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-extrabold text-[#003631]">Edit Member</h2>
                        <button onClick={() => setEditingMember(null)}><X size={24} className="text-gray-400" /></button>
                    </div>

                    <form onSubmit={handleUpdateMember} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-bold text-gray-700 ml-1">Full Name</label>
                            <input
                                type="text"
                                value={editFormData.name}
                                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#003631]/10 outline-none text-sm"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-bold text-gray-700 ml-1">Email</label>
                            <input
                                type="email"
                                value={editFormData.email}
                                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#003631]/10 outline-none text-sm"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-bold text-gray-700 ml-1">Role</label>
                            <select
                                value={editFormData.role}
                                onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                                className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#003631]/10 outline-none text-sm appearance-none"
                            >
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-bold text-gray-700 ml-1">Designation</label>
                            <input
                                type="text"
                                value={editFormData.designation}
                                onChange={(e) => setEditFormData({ ...editFormData, designation: e.target.value })}
                                className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#003631]/10 outline-none text-sm"
                                placeholder="e.g. Frontend Engineer"
                            />
                        </div>

                        {message.text && (
                            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
                                message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                            }`}>
                                {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                {message.text}
                            </div>
                        )}

                        <Button type="submit" disabled={editLoading} className="w-full py-4 rounded-2xl font-bold bg-[#003631] text-white">
                            {editLoading ? 'Updating...' : 'Save Changes'}
                        </Button>
                    </form>
                </div>
            </div>
        )}

      </main>
    </>
  );
}
