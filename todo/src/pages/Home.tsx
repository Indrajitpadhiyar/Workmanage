import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-gray-100">
        <div className="w-16 h-16 bg-[#003631] text-[#FFEDA8] rounded-2xl mx-auto flex items-center justify-center text-3xl font-bold mb-6">
          T
        </div>
        <h1 className="text-3xl font-bold text-[#003631] mb-2">IDR TaskFlow</h1>
        <p className="text-gray-500 mb-8 text-sm">Select your demo environment</p>
        <div className="space-y-4">
          <Link to="/login" className="block w-full bg-[#003631] text-white rounded-xl py-3.5 font-semibold shadow-md hover:bg-[#003631]/90 transition-colors">
            Login
          </Link>
          <Link to="/register" className="block w-full bg-[#FFEDA8] text-[#003631] rounded-xl py-3.5 font-semibold shadow-md hover:bg-[#FFEDA8]/90 transition-colors">
            Register
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-400">Company Task Management System</p>
      </div>
    </div>
  );
}
