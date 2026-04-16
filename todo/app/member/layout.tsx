'use client';

import React from 'react';
import { Sidebar } from '@/components/ui/Sidebar';

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar role="member" />
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}
