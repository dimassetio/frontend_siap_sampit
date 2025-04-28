// File: src/pages/MahasiswaDashboard.jsx
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { FaCheckCircle, FaClipboardList, FaCog, FaEye, FaHourglassHalf, FaSpinner } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { formatDate } from "../utils/dateformatter";

const DashboardStats = ({ summary, totalReports }) => {
  const stats = [
    {
      title: "Total Laporan",
      icon: <FaClipboardList className="text-3xl text-indigo-600" />,
      value: totalReports || 0,
      color: "text-indigo-600",
    },
    {
      title: "Laporan Baru",
      icon: <FaHourglassHalf className="text-3xl text-yellow-500" />,
      value: summary?.menunggu || 0,
      color: "text-yellow-500",
    },
    {
      title: "Laporan Diproses",
      icon: <FaCog className="text-3xl text-blue-600" />,
      value: summary?.diproses || 0,
      color: "text-blue-600",
    },
    {
      title: "Laporan Selesai",
      icon: <FaCheckCircle className="text-3xl text-green-600" />,
      value: summary?.selesai || 0,
      color: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white shadow p-4 rounded-lg flex items-center space-x-4">
          <div>{stat.icon}</div>
          <div>
            <div className={`text-sm font-semibold ${stat.color}`}>{stat.title}</div>
            <div className="text-xl font-bold">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function MahasiswaDashboard() {

  const [totalReports, setTotalReports] = useState(0);
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1
  });
  const [summary, setSummary] = useState({
    menunggu: 0,
    diproses: 0,
    selesai: 0
  });

  const page = pagination.currentPage;
  const limit = 10;

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/reports/my-report?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.data;

      setReports(data.data);
      setPagination({
        totalItems: data.totalItems,
        totalPages: data.totalPages,
        currentPage: data.currentPage
      });
      setTotalReports(data.totalItems);
      setSummary(data.summary);

    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page]); // Re-fetch when the page changes

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Selamat datang, Mahasiswa</h2>
        <p className="text-gray-600 mb-6">Berikut adalah laporan yang telah kamu ajukan.</p>
        <DashboardStats summary={summary} totalReports={totalReports} />

        <div className="my-6">
          <Link
            to="/mahasiswa/laporan"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
          >
            + Buat Laporan Baru
          </Link>
        </div>

        {/* Tabel Laporan Saya */}
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Laporan Saya</h3>
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="text-sm text-gray-600 border-b">
                <th className="py-2">No</th>
                <th className="py-2">Judul</th>
                <th className="py-2">Status</th>
                <th className="py-2">Tanggapan</th>
                <th className="py-2">Tanggal</th>
                <th className="py-2">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {reports.map((laporan, i) => (
                <tr key={laporan.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{(page - 1) * limit + i + 1}</td>
                  <td className="py-2">{laporan.title}</td>
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
                  <td className="py-2">{laporan.replies.length}</td>
                  <td className="py-2">{formatDate(laporan.createdAt)}</td>
                  <td className="py-2 space-x-2">
                    <button
                      onClick={() => navigate(`/mahasiswa/laporan/${laporan._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 p-2 rounded text-white"
                      title="Detail"
                    >
                      <FaEye />
                    </button>
                  </td>
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
    </AdminLayout>
  );
}
