import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import LaporanIndex from "./pages/Laporan";
import UserIndex from "./pages/User";
import LaporanDetail from "./pages/LaporanDetail";
import UserForm from "./pages/UserForm";
import UserDetail from "./pages/UserDetail";
import LaporanForm from "./pages/LaporanForm";
import MahasiswaDashboard from "./pages/MahasiswaDashboard";
import Homepage from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import PetugasDashboard from "./pages/PetugasDashboard";

function AppRoutes() {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Role: Admin */}
        <Route path="/admin" element={<PrivateRoute requiredRole="admin"><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/reports" element={<PrivateRoute requiredRole="admin"><LaporanIndex /></PrivateRoute>} />
        <Route path="/admin/reports/detail/:id" element={<PrivateRoute requiredRole="admin"><LaporanDetail /></PrivateRoute>} />
        <Route path="/admin/reports/form" element={<PrivateRoute requiredRole="admin"><LaporanForm /></PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute requiredRole="admin"><UserIndex /></PrivateRoute>} />
        <Route path="/admin/users/edit/:id" element={<PrivateRoute requiredRole="admin"><UserForm /></PrivateRoute>} />
        <Route path="/admin/users/create/" element={<PrivateRoute requiredRole="admin"><UserForm /></PrivateRoute>} />
        <Route path="/admin/users/detail/:id" element={<PrivateRoute requiredRole="admin"><UserDetail /></PrivateRoute>} />
        {/* Role: User */}
        <Route path="/mahasiswa" element={<PrivateRoute requiredRole="mahasiswa"><MahasiswaDashboard /></PrivateRoute>} />
        <Route path="/mahasiswa/laporan/" element={<PrivateRoute requiredRole="mahasiswa"><LaporanForm /></PrivateRoute>} />
        <Route path="/mahasiswa/laporan/:id" element={<PrivateRoute requiredRole="mahasiswa"><LaporanDetail /></PrivateRoute>} />
        {/* Role: Petugas */}
        <Route path="/petugas" element={<PrivateRoute requiredRole="petugas"><PetugasDashboard /></PrivateRoute>} />
        <Route path="/petugas/laporan/:id" element={<PrivateRoute requiredRole="petugas"><LaporanDetail /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
