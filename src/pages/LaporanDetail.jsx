import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import AdminLayout from "../layouts/AdminLayout";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../utils/dateformatter";
import AddReplyModal from "../components/AddReplyModal";
import LaporanActionButtons from "../components/LaporanActions";
import axios from 'axios';
import ModalLoading from "../components/ModalLoading";

export default function LaporanDetail() {
  const [modalType, setModalType] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("menunggu");
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value); // Update the selected status
  };

  const handleOpenModal = (type) => setModalType(type);
  const handleCloseModal = () => setModalType(null);

  const { id } = useParams();
  const [laporan, setLaporan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLaporanDetail = async () => {
      try {
        setLoading(false);
        const res = await fetch(`${process.env.REACT_APP_API_URL}/reports/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Gagal memuat data laporan");
        }

        const data = await res.json();

        setLaporan(data);

        const combinedTimeline = [
          ...data.statusHistory.map(item => ({
            type: "status",
            status: item.status,
            updatedAt: item.updatedAt,
            updatedBy: item.updatedBy
          })),
          ...data.replies.map(item => ({
            type: "reply",
            message: item.message,
            updatedAt: item.createdAt,
            sender: item.senderId.name
          }))
        ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        setTimeline(combinedTimeline);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchLaporanDetail();
  }, [id]);

  const updateReportStatus = async (status) => {
    try {
      console.log(status);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reports/${laporan._id}/status`, {
        method: 'PATCH', // You can use POST or PATCH depending on your backend setup
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          status: status,
          updatedBy: user._id,
        }),
      });

      console.log(response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }
      window.location.reload();
    } catch (error) {
      console.error('Error updating report status:', error.message);
      // Optionally, show an error message to the user
    }
  };

  const deleteReport = async (id) => {
    try {
      // Send DELETE request to the backend API
      const response = await axios.delete(`/api/reports/${id}`);
      if (response.ok) {
        // Handle successful response
        navigate('/admin/reports');
      } else {
        alert("Gagal menghapus laporan")
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      alert("Error deleting the report"); // Show error message
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {loading && <ModalLoading />}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Detail Laporan</h2>
        </div>

        {/* 2 Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Informasi User - 1/3 width */}
          <div className="bg-white p-6 rounded-xl shadow w-full lg:w-1/3">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Informasi Pengadu</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center">
                <FaUser className="mr-2 text-indigo-600" />
                <span>Nama: <strong>{laporan && laporan.userId.name}</strong></span>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="mr-2 text-indigo-600" />
                <span>Email: <strong>{laporan && laporan.userId.email}</strong></span>
              </div>
              <div className="flex items-center">
                <FaPhone className="mr-2 text-indigo-600" />
                <span>No HP: <strong>{laporan && laporan.userId.phone}</strong></span>
              </div>
            </div>
          </div>

          {/* Detail Aduan - 2/3 width */}
          <div className="bg-white p-6 rounded-xl shadow w-full lg:w-2/3">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Detail Aduan</h3>
            {laporan &&
              <div className="space-y-4 text-sm text-gray-800">
                <div>
                  <span className="font-medium">Judul:</span> {laporan.title}
                </div>
                <div>
                  <span className="font-medium">Deskripsi:</span> {laporan.description}
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <span className={`ms-2 px-2 py-1 rounded-full text-xs font-medium
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
                </div>
                {laporan.attachment &&
                  <div>
                    <span className="font-medium">Gambar:</span>
                    <img
                      src={process.env.REACT_APP_IMAGE_URL + laporan.attachment}
                      alt="Gambar Aduan"
                      className="rounded-lg mt-2 w-96 border"
                    />
                  </div>}
              </div>}
          </div>
        </div>

        {/* Riwayat Tanggapan */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Riwayat Laporan</h3>
          <div className="space-y-4">
            {timeline.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-4 border-l-2">
                <div className=" pl-4">
                  <p className="text-sm text-gray-500">
                    {formatDate(item.updatedAt)}
                  </p>
                  {item.type === "status" ? (
                    <div>
                      <p className="text-blue-600 font-semibold">Status diubah menjadi <span className="capitalize">{item.status}</span></p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-800">{item.message}</p>
                      <p className="text-sm text-gray-500 italic">Dikirim oleh: {item.sender || "User"}</p>
                    </div>
                  )}
                </div>
                {/* <span className="font-medium text-sm text-gray-700">Pengguna: <strong>{item.updatedBy}</strong></span> */}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <LaporanActionButtons
          user={user}
          laporan={laporan}
          handleOpenModal={handleOpenModal}
        />

        {/* Modal */}
        <Modal open={modalType !== null} onClose={handleCloseModal}>
          {modalType === "status" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Ubah Status Laporan</h3>
              <select className="w-full border p-2 rounded"
                value={selectedStatus}
                onChange={handleStatusChange}>
                <option value="menunggu">Menunggu</option>
                <option value="diproses">Diproses</option>
                <option value="dibatalkan">Dibatalkan</option>
                <option value="selesai">Selesai</option>
              </select>
              <div className="text-right mt-4">
                <button onClick={() => updateReportStatus(selectedStatus)} className="bg-indigo-600 text-white px-4 py-2 rounded">Simpan</button>
              </div>
            </div>
          )}

          {modalType === "proses" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Proses Aduan</h3>
              <p className="text-sm text-gray-700">Apakah Anda yakin ingin memproses aduan ini?</p>
              <div className="text-right mt-4">
                <button onClick={() => updateReportStatus('diproses')} className="bg-green-600 text-white px-4 py-2 rounded">Ya, Proses</button>
              </div>
            </div>
          )}

          {modalType === "selesaikan" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Selesaikan Aduan</h3>
              <p className="text-sm text-gray-700">Apakah Anda yakin ingin menyelesaikan aduan ini?</p>
              <div className="text-right mt-4">
                <button onClick={() => updateReportStatus('selesai')} className="bg-green-600 text-white px-4 py-2 rounded">Ya, Proses</button>
              </div>
            </div>
          )}

          {modalType === "batalkan" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Batalkan Aduan</h3>
              <p className="text-sm text-gray-700">Apakah Anda yakin ingin membatalkan aduan ini?</p>
              <div className="text-right mt-4">
                <button onClick={() => updateReportStatus('dibatalkan')} className="bg-green-600 text-white px-4 py-2 rounded">Ya, Proses</button>
              </div>
            </div>
          )}

          {modalType === "bukaKembali" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Buka Kembali Aduan</h3>
              <p className="text-sm text-gray-700">Apakah Anda yakin ingin memproses kembali aduan ini?</p>
              <div className="text-right mt-4">
                <button onClick={() => updateReportStatus('dibatalkan')} className="bg-green-600 text-white px-4 py-2 rounded">Ya, Proses</button>
              </div>
            </div>
          )}

          {modalType === "hapus" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Hapus Aduan</h3>
              <p className="text-sm text-gray-700">Apakah Anda yakin ingin menghapus aduan ini?</p>
              <div className="text-right mt-4">
                <button onClick={() => deleteReport(laporan._id)} className="bg-green-600 text-white px-4 py-2 rounded">Ya, Proses</button>
              </div>
            </div>
          )}

          {modalType === "tanggapan" && (
            <AddReplyModal
              reportId={laporan._id}
              onClose={handleCloseModal}
              onSuccess={() => { window.location.reload(); }}
            />
          )}
        </Modal>
      </div>
    </AdminLayout >
  );
}
