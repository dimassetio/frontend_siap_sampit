import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaBars, FaUserCircle } from "react-icons/fa";

const Navbar = ({ toggleSidebar }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm("Apakah Anda yakin ingin logout?");
    if (confirmed) {
      logout();
      navigate("/");
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm relative">
      {/* Sidebar toggle icon */}
      <button
        onClick={toggleSidebar}
        className="text-gray-600 text-xl mr-4"
      >
        <FaBars />
      </button>

      <div className="relative ml-auto">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 text-gray-700 hover:text-indigo-800"
        >
          <FaUserCircle className="text-2xl text-indigo-800" />
          <span className="hidden md:inline">
            {user?.name || "User"}
          </span>
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
            {/* <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Profile
            </button> */}
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
