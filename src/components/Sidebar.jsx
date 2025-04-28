import { FaUserCog, FaRegFileAlt, FaSignOutAlt, FaThLarge } from "react-icons/fa";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext"
import logo from "../assets/logo.png";

export default function Sidebar({ isExpanded }) {
  const { pathname: currentPath } = useLocation(); // Mendapatkan current path dari useLocation
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // Ambil data user dari localStorage
    const userData = JSON.parse(localStorage.getItem("user"));

    // Jika tidak ada userData, bisa redirect atau handle error
    if (!userData) return;

    // Ambil role user
    const role = userData.role;

    const adminMenu = [
      { name: "Dashboard", icon: <FaThLarge />, path: "/admin" },
      { name: "Data Laporan", icon: <FaRegFileAlt />, path: "/admin/reports" },
      { name: "Data Pengguna", icon: <FaUserCog />, path: "/admin/users" },
    ];

    const petugasMenu = [
      { name: "Dashboard", icon: <FaThLarge />, path: "/petugas" },
    ];

    const mahasiswaMenu = [
      { name: "Dashboard", icon: <FaThLarge />, path: "/mahasiswa" },

    ];

    if (role === "admin") {
      setMenuItems([...adminMenu]);
    } else if (role === "petugas") {
      setMenuItems([...petugasMenu]);
    } else if (role === "mahasiswa") {
      setMenuItems([...mahasiswaMenu]);
    }
  }, []);


  const handleLogout = () => {
    const confirmed = window.confirm("Apakah Anda yakin ingin logout?");
    if (confirmed) {
      navigate("/");
      logout();
    }
  };

  return (
    <div
      className={`${isExpanded ? "w-20 md:w-64" : "w-0 md:w-20"} bg-white border-r h-screen transition-all duration-300 shadow-sm flex flex-col`}
    >
      <div className="flex items-center justify-center px-4 py-4 border-b">
        <img
          src={logo}
          alt="Logo"
          className={`${isExpanded ? "w-16 md:w-32" : "w-16"} h-auto transition-all`}
        />
      </div>
      <nav className="mt-4 flex-1">
        {menuItems.map((item) => {
          // Cek jika path item adalah '/admin/users' atau '/admin/reports'
          const isActive = (item.path === "/admin/users" && currentPath.startsWith("/admin/users")) ||
            (item.path === "/admin/reports" && currentPath.startsWith("/admin/reports")) || (item.path === currentPath);

          return (
            <NavLink
              to={item.path}
              key={item.name}
              className={`flex items-center gap-3 px-4 py-3 m-2 rounded-lg text-sm font-medium transition hover:bg-indigo-100
                ${isActive ? "bg-indigo-800 text-white hover:text-indigo-800" : "text-gray-700"}
                ${!isExpanded ? "justify-center" : ""}`}
            >
              <span className="text-lg">{item.icon}</span>

              {/* Show name only if expanded and screen size is md or larger */}
              {isExpanded && (
                <span className="hidden md:inline">
                  {item.name}
                </span>
              )}
            </NavLink>
          );
        })}
        <div
          className={`flex items-center gap-3 px-4 py-3 m-2 rounded-lg text-sm font-medium transition hover:bg-indigo-100 text-gray-700
                ${!isExpanded ? "justify-center" : ""}`}
          onClick={handleLogout}
        >
          <span className="text-lg"><FaSignOutAlt /></span>

          {/* Show name only if expanded and screen size is md or larger */}
          {isExpanded && (
            <span className="hidden md:inline">
              Keluar
            </span>
          )}
        </div>
      </nav>
    </div>
  );
}
