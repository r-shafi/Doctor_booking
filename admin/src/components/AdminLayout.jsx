// src/components/AdminLayout.jsx
import React from 'react';
import Sidebar from './Sidebar'; // Adjust the path if needed

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-100 min-h-screen p-4">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
