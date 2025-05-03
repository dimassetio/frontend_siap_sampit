// File: src/pages/Register.jsx
import { useContext, useState } from "react";
import {
  FaUser,
  FaIdBadge,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaMobile,
} from "react-icons/fa";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useContext(AuthContext);

  const [nim, setNim] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nim, name, email, phone, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Simpan token ke localStorage atau context
        login(data.user, data.user.token);
        // Redirect berdasarkan role
        navigate('/mahasiswa');
      } else {
        alert(data.message || 'Registrasi gagal');
      }
    } catch (err) {
      console.log(err)
      alert('Terjadi kesalahan: ' + err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-4 border-b">
          <img
            src={logo}
            alt="Logo"
            className="w-32 h-auto transition-all"
          />
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-center">Daftar Akun</h2>

        <form className="space-y-4">
          {/* Name */}
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
            <FaUser className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Nama Lengkap"
              className="w-full bg-transparent outline-none text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* NIM */}
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
            <FaIdBadge className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="NIM"
              className="w-full bg-transparent outline-none text-sm"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
            <FaMobile className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="No. Hp"
              className="w-full bg-transparent outline-none text-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Email */}
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

          {/* Confirm Password */}
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 relative">
            <FaLock className="text-gray-400 mr-3" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Konfirmasi Kata Sandi"
              className="w-full bg-transparent outline-none text-sm"
            />
            <div
              className="absolute right-3 cursor-pointer text-gray-400"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            onClick={loading ? null : handleRegister}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-semibold"
          >
            {loading ? 'Loading...' : 'Daftar'}
          </button>

          <p className="text-sm text-center mt-4">
            Sudah punya akun?{" "}
            <a href="/login" className="text-indigo-600 font-medium hover:underline">
              Masuk di sini
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
