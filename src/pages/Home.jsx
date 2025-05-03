import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { formatDate } from "../utils/dateformatter";
import { useNavigate } from "react-router-dom";

const TutorialSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const steps = [
    {
      title: "1. Daftar Akun",
      content:
        "Masukkan Nama Lengkap, NIM, Email aktif, dan Nomor HP yang bisa dihubungi.",
    },
    {
      title: "2. Login",
      content: "Masuk ke sistem menggunakan akun yang telah terdaftar.",
    },
    {
      title: "3. Buka Menu Laporan",
      content: "Navigasikan ke halaman 'Laporan' melalui menu utama.",
    },
    {
      title: "4. Buat Pengajuan",
      content:
        "Klik tombol 'Buat Laporan Baru' dan isi formulir laporan yang tersedia.",
    },
    {
      title: "5. Konfirmasi",
      content:
        "Setelah mengirimkan laporan, sistem akan menyimpan dan menampilkan notifikasi bahwa laporan berhasil dibuat.",
    },
    {
      title: "6. Tracking",
      content:
        "Pengguna dapat memantau status laporannya secara real-time melalui dashboard pengguna.",
    },
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section id="tutorials" className="bg-white py-16">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-2">Tata Cara Penggunaan</h2>
        <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
        <div className="max-w-screen-md mx-auto">
          <div className="text-left w-full mx-auto space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="border-b border-gray-300 text-gray-600 hover:text-primary"
              >
                <button
                  className={`w-full flex justify-between items-center px-6 py-4 text-left font-medium  focus:outline-none transition ${activeIndex === index ? "text-primary text-bold" : ""}`}
                  onClick={() => toggleAccordion(index)}
                >
                  <span>{step.title}</span>
                  <FaChevronDown
                    className={`transform transition-transform duration-300 ${activeIndex === index ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`px-6 pt-0 pb-4 text-gray-700 transition-all duration-300 ease-in-out ${activeIndex === index ? "block" : "hidden"}`}
                >
                  {step.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section >
  );
};

export default function Homepage() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const [latestReports, setLatestReports] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1
  });
  const page = pagination.currentPage;
  const limit = 10;

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/reports?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.data;

      setLatestReports(data.data);
      setPagination({
        totalItems: data.totalItems,
        totalPages: data.totalPages,
        currentPage: data.currentPage
      });

    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  return (
    <div className="font-sans bg-gray-100">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-bg_primary p-4 shadow-md">
        <div className="container max-w-screen-xl mx-auto flex justify-between items-center">
          {/* Logo + Brand Name */}
          <div className="flex items-center space-x-2">
            <img src="assets/maskot_siap.png" alt="Logo" className="h-10 w-auto" /> {/* Ganti dengan path logo kamu */}
            <span className="hidden sm:block text-xl font-bold ">Sistem Informasi Aduan Politeknik</span>
          </div>

          {/* Navigation Links */}
          <ul className="hidden md:flex space-x-6 ">
            <li><a href="#hero" className="hover:text-primary">Beranda</a></li>
            <li><a href="#about" className="hover:text-primary">Tentang</a></li>
            <li><a href="#tutorials" className="hover:text-primary">Tata Cara</a></li>
            <li><a href="#reports" className="hover:text-primary">Laporan</a></li>
          </ul>

          {/* Login Button */}
          <a href={user !== null ? '/' + user.role : "/login"} className="bg-primary text-bg_primary font-semibold px-4 py-2 rounded hover:bg-opacity-80">
            {user !== null ? 'Dashboard' : 'Login'}
          </a>
        </div>
      </nav>

      {/* Section Hero */}
      <section id="hero" className="pt-24 bg-bg_primary min-h-screen flex items-center">
        <div className="container max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-4">

          {/* Kolom Kiri - Teks dan CTA */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Layanan Pengaduan Politeknik Sampit
            </h1>
            <p className="text-lg mb-6">
              Sampaikan laporan masalah Anda di sini. Kami akan memprosesnya dengan cepat!
            </p>
            <a href={user !== null ? '/' + user.role : "/login"} className="bg-primary text-bg_primary font-semibold px-6 py-3 rounded hover:bg-opacity-80 transition">
              Laporkan
            </a>

          </div>

          {/* Kolom Kanan - Gambar */}
          <div className="flex justify-center">
            <img
              src="assets/hero-img.png"
              alt="Hero Illustration"
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Section About */}
      <section id="about" className="bg-gray-100 py-16">
        <div className="max-w-screen-lg mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-2">Tentang Kami</h2>

          {/* Garis di tengah */}
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>

          <p className="text-gray-700 leading-relaxed">
            Sistem Informasi Aduan Mahasiswa Politeknik Sampit adalah sebuah platform digital yang dirancang untuk mempermudah mahasiswa dalam menyampaikan keluhan, saran, dan laporan secara efektif dan transparan. Sistem ini memungkinkan mahasiswa untuk menyuarakan permasalahan yang mereka hadapi di lingkungan kampus, baik akademik maupun non-akademik, sehingga pihak kampus dapat menindaklanjuti dengan cepat dan tepat.
          </p>
        </div>
      </section>

      {/* Tutorial Section */}
      <TutorialSection />

      {/* Section Laporan */}
      <section id="reports" className="bg-gray-100 py-16">
        <div className="max-w-screen-lg mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-2">Laporan Terbaru</h2>

          {/* Garis di tengah */}
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>

          <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="text-sm text-gray-600 border-b">
                  <th className="py-2">No</th>
                  <th className="py-2">Judul</th>
                  <th className="py-2">Deskripsi</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Tanggal</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {latestReports && latestReports.map((laporan, i) => (
                  <tr onClick={() => navigate(`laporan/${laporan._id}`)} key={laporan.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{i + 1}</td>
                    <td className="py-2">{laporan.title}</td>
                    <td className="py-2">{laporan.description}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${laporan.status === "selesai"
                          ? "bg-green-100 text-green-700"
                          : laporan.status === "diproses"
                            ? "bg-blue-100 text-blue-700"
                            : laporan.status === "dibatalkan"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}>
                        {laporan.status}
                      </span>
                    </td>
                    <td className="py-2">{formatDate(laporan.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end items-center mt-4 gap-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm">
                Halaman {page} dari {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pagination.totalPages}
                className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-200 mt-12 py-6 px-4">
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
};
