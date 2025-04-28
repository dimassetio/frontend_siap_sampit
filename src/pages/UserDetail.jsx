import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { FaEnvelope, FaPhone, FaUser } from "react-icons/fa";

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [riwayatLaporan, setRiwayatLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Gagal memuat data pengguna");
        }

        const data = await res.json();
        setUser(data); // sesuaikan struktur respons dari API
        setRiwayatLaporan(data.riwayatLaporan || []); // jika laporan dikirim bersamaan
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-semibold">Detail Pengguna</h2>

        {/* Informasi User */}
        <div className="bg-white p-6 rounded-xl shadow w-full">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Informasi Pengguna</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center">
              <FaUser className="mr-2 text-indigo-600" />
              <span>Nama: <strong>{user?.name}</strong></span>
            </div>
            <div className="flex items-center">
              <FaEnvelope className="mr-2 text-indigo-600" />
              <span>Email: <strong>{user?.email}</strong></span>
            </div>
            <div className="flex items-center">
              <FaPhone className="mr-2 text-indigo-600" />
              <span>No HP: <strong>{user?.phone}</strong></span>
            </div>
          </div>
        </div>

        {/* Riwayat Laporan */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Riwayat Laporan Pengaduan</h3>

          {riwayatLaporan.length > 0 ? (
            <div className="space-y-4">
              {riwayatLaporan.map((laporan) => (
                <div key={laporan.id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-md font-semibold text-indigo-600">{laporan.judul}</h4>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {laporan.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{laporan.deskripsi}</p>
                  <span className="text-xs text-gray-500">Tanggal: {laporan.tanggal}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Belum ada riwayat laporan.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
