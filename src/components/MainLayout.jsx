import React from 'react';
import { Outlet } from 'react-router-dom';
import SideNav from './SideNav';

const MainLayout = ({ user }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideNav userRole={user.role} />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
