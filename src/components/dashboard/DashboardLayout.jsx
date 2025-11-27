import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <DashboardSidebar />
            <div className="flex-1 overflow-auto">
                <DashboardHeader />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}