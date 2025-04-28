import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AdminLayout({ children }) {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    const isSmallScreen = window.innerWidth < 768; // Tailwind 'md' breakpoint
    setSidebarExpanded(!isSmallScreen);
  }, []);

  return (
    <div className="flex">
      <Sidebar isExpanded={isSidebarExpanded} />
      <div className="flex-1 min-h-screen bg-gray-50">
        <Navbar toggleSidebar={() => setSidebarExpanded((prev) => !prev)} />
        {children}
      </div>
    </div>
  );
}