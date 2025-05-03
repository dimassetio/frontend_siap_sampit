
import React from "react";

export default function HomeLayout({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="font-sans bg-gray-100">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-bg_primary p-4 shadow-md">
        <div className="container max-w-screen-xl mx-auto flex justify-between items-center">
          {/* Logo + Brand Name */}
          <a href="/" className="flex items-center space-x-2">
            <img src="/assets/maskot_siap.png" alt="Logo" className="h-10 w-auto" /> {/* Ganti dengan path logo kamu */}
            <span className="hidden sm:block text-xl font-bold ">Sistem Informasi Aduan Politeknik</span>
          </a>
          {/* Navigation Links */}
          <ul className="hidden md:flex space-x-6 ">
            <li><a href="/#hero" className="hover:text-primary">Beranda</a></li>
            <li><a href="/#about" className="hover:text-primary">Tentang</a></li>
            <li><a href="/#tutorials" className="hover:text-primary">Tata Cara</a></li>
            <li><a href="/#reports" className="hover:text-primary">Laporan</a></li>
          </ul>

          {/* Login Button */}
          <a href={user !== null ? '/' + user.role : "/login"} className="bg-primary text-bg_primary font-semibold px-4 py-2 rounded hover:bg-opacity-80">
            {user !== null ? 'Dashboard' : 'Login'}
          </a>
        </div>
      </nav>

      {children}

      <footer className="bg-white border-t border-gray-200 mt-6 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <img src="/assets/logo-politeknik.png" alt="Logo 1" className="h-10" />
            <img src="/assets/logo.png" alt="Logo 2" className="h-10" />
            <span className=" ml-2 text-lg font-semibold text-gray-800">Sistem Informasi Aduan Politeknik Sampit</span>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-500 text-center md:text-right">
            &copy; {new Date().getFullYear()} SIAP. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}