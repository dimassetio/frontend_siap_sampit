import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { FaEye } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { formatDate } from "../utils/dateformatter";
import DropdownFilter from "../components/DropdownFilter";
import DashboardStats from "../components/DashboardStats";

export default function PetugasDashboard() {

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

  const [statusFilter, setStatusFilter] = useState("");

  const page = pagination.currentPage;
  const limit = 10;

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/reports?page=${page}&limit=${limit}&status=${statusFilter}`, {
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
  }, [page, statusFilter]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Selamat datang, Petugas</h2>
        <p className="text-gray-600 mb-6">Berikut adalah laporan yang perlu diproses.</p>
        <DashboardStats summary={summary} totalReports={totalReports} />

        {/* Tabel Laporan Untuk Diproses */}
        <div className="bg-white rounded shadow p-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold ">Daftar Laporan</h3>
            <DropdownFilter
              options={[
                { label: "Semua", value: "" },
                { label: "Menunggu", value: "menunggu" },
                { label: "Diproses", value: "diproses" },
                { label: "Selesai", value: "selesai" },
                { label: "Dibatalkan", value: "dibatalkan" },
              ]}
              selected={
                [
                  { label: "Semua", value: "" },
                  { label: "Menunggu", value: "menunggu" },
                  { label: "Diproses", value: "diproses" },
                  { label: "Selesai", value: "selesai" },
                  { label: "Dibatalkan", value: "dibatalkan" },
                ].find((option) => option.value === statusFilter)
              }
              onChange={(option) => {
                setStatusFilter(option.value);
                setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset ke page 1
              }}
            />
          </div>
          <hr className="mb-2" />
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="text-sm text-gray-600 border-b">
                <th className="py-2">No</th>
                <th className="py-2">Judul</th>
                <th className="py-2">Status</th>
                <th className="py-2">Pelapor</th>
                <th className="py-2">Tanggal</th>
                <th className="py-2">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {reports && reports.map((laporan, i) => (
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
                  <td className="py-2">{laporan.userId.name}</td>
                  <td className="py-2">{formatDate(laporan.createdAt)}</td>
                  <td className="py-2 space-x-2">
                    <button
                      onClick={() => navigate(`/petugas/laporan/${laporan._id}`)}
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
