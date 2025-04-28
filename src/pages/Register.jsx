// File: src/pages/Register.jsx
import { useState } from "react";
import {
  FaUser,
  FaIdBadge,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import logo from "../assets/logo.png";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            />
          </div>

          {/* NIM */}
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
            <FaIdBadge className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="NIM"
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>

          {/* Email */}
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
            <FaEnvelope className="text-gray-400 mr-3" />
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>

          {/* Password */}
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 relative">
            <FaLock className="text-gray-400 mr-3" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Kata Sandi"
              className="w-full bg-transparent outline-none text-sm"
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
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-semibold"
          >
            Daftar
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
