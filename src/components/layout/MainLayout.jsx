import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#121212] font-sans antialiased selection:bg-[#C5A880]/20 selection:text-[#121212]">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
