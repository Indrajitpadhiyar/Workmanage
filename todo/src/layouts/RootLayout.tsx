import React from 'react';
import { SidebarProvider } from '@/lib/context/SidebarContext';
import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-full flex flex-col">
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
