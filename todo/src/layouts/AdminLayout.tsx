import React from 'react';
import { Sidebar } from '@/components/ui/Sidebar';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar role="admin" />
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
