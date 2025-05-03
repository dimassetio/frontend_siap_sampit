import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatDate } from "../utils/dateformatter";
import ModalLoading from "../components/ModalLoading";
import StatusTimeline from "../components/StatusTimeline";
import HomeLayout from "../layouts/HomeLayout";

export default function HomeDetailLaporan() {

  const { id } = useParams();
  const [laporan, setLaporan] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchLaporanDetail = async () => {
      try {
        setLoading(false);
        const res = await fetch(`${process.env.REACT_APP_API_URL}/reports/${id}`);

        if (!res.ok) {
          throw new Error("Gagal memuat data laporan");
        }

        const data = await res.json();

        setLaporan(data);

        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }
    fetchLaporanDetail();
  }, [id]);

  return (
    <HomeLayout>
      <div className="max-w-screen-xl mx-auto pt-24">
        <div className="p-6">
          {loading && <ModalLoading />}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Detail Laporan</h2>
          </div>

          {/* 2 Column Layout */}
          <div className="flex flex-col lg:flex-row gap-6 mb-6">


            {/* Detail Aduan - 2/3 width */}
            <div class="w-full lg:w-2/3">
              <div className="bg-white p-6 rounded-xl shadow w-full mb-4">
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
              {/* Riwayat Tanggapan */}
              <div className="bg-white p-6 rounded-xl shadow mb-6">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Riwayat Tanggapan</h3>
                <div className="space-y-4">
                  {laporan && laporan.replies && laporan.replies.map((item, index) => (
                    <div key={index} className="flex justify-between items-center mb-4 border-l-2">
                      <div className=" pl-4">
                        <p className="text-sm text-gray-500">
                          {formatDate(item.createdAt)}
                        </p>
                        <div>
                          <p className="text-gray-800">{item.message}</p>
                          <p className="text-sm text-gray-500 italic">Dikirim oleh: {item.senderId.name || "User"}</p>
                        </div>

                      </div>
                      {/* <span className="font-medium text-sm text-gray-700">Pengguna: <strong>{item.updatedBy}</strong></span> */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Informasi User - 1/3 width */}
            <div class="lg:w-1/3">
              <div className="bg-white p-6 rounded-xl shadow w-full mb-4">
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
              <div className="bg-white p-6 rounded-xl shadow w-full mb-2">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Riwayat Status</h3>
                {laporan && laporan.statusHistory &&
                  <StatusTimeline
                    items={laporan.statusHistory}
                  />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout >
  );
}
