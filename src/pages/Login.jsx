// File: src/pages/Login.jsx
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useContext, useState } from "react";
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Simpan token ke localStorage atau context
        login(data.user, data.user.token);
        // Redirect berdasarkan role
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else if (data.user.role === 'petugas') {
          navigate('/petugas');
        } else {
          navigate('/mahasiswa');
        }

        // Arahkan ke halaman dashboard, dll
      } else {
        alert(data.message || 'Login gagal');
      }
    } catch (err) {
      console.log(err)
      // alert('Terjadi kesalahan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-4 border-b">
          <img
            src={logo}
            alt="Logo"
            className={`w-32 h-auto transition-all`}
          />
        </div>
        <h2 className="text-2xl font-semibold mb-6 text-center">Masuk Akun</h2>

        <form className="space-y-4" onSubmit={loading ? null : handleLogin}>
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
            <FaEnvelope className="text-gray-400 mr-3" />
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-transparent outline-none text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 relative">
            <FaLock className="text-gray-400 mr-3" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Kata Sandi"
              className="w-full bg-transparent outline-none text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div
              className="absolute right-3 cursor-pointer text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-semibold"
          >
            {loading ? 'Loading...' : 'Masuk'}
          </button>

          <p className="text-sm text-center mt-4">
            Belum punya akun?{" "}
            <a href="/register" className="text-indigo-600 font-medium hover:underline">
              Daftar di sini
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
