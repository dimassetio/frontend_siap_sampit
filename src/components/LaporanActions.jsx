import { FaEdit, FaCheckCircle, FaTimes, FaCommentDots, FaTrash } from "react-icons/fa";

const getAvailableActions = (role, status) => {
  if (role === "admin") {
    return ["ubahStatus", "beriTanggapan", "hapus"];
  }
  if (role === "petugas") {
    if (status === "menunggu") return ["prosesAduan"];
    if (status === "diproses") return ["beriTanggapan", "selesaikan", "batalkan"];
    if (status === "selesai" || status === "dibatalkan") return ["prosesAduan"];
  }
  if (role === "mahasiswa") {
    if (status === "menunggu" || status === "diproses") return ["beriTanggapan", "batalkan"];
    if (status === "selesai" || status === "dibatalkan") return ["bukaKembali"];
  }
  return [];
};

const actionButtons = {
  ubahStatus: {
    label: "Ubah Status",
    icon: <FaEdit />,
    color: "bg-yellow-500 hover:bg-yellow-600",
    modal: "status",
  },
  prosesAduan: {
    label: "Proses Aduan",
    icon: <FaCheckCircle />,
    color: "bg-green-600 hover:bg-green-700",
    modal: "proses",
  },
  beriTanggapan: {
    label: "Beri Tanggapan",
    icon: <FaCommentDots />,
    color: "bg-indigo-600 hover:bg-indigo-700",
    modal: "tanggapan",
  },
  selesaikan: {
    label: "Selesaikan",
    icon: <FaCheckCircle />,
    color: "bg-green-800 hover:bg-green-900",
    modal: "selesaikan",
  },
  batalkan: {
    label: "Batalkan Aduan",
    icon: <FaTimes />,
    color: "bg-red-600 hover:bg-red-700",
    modal: "batalkan",
  },
  bukaKembali: {
    label: "Buka Kembali",
    icon: <FaEdit />,
    color: "bg-blue-600 hover:bg-blue-700",
    modal: "bukaKembali",
  },
  hapus: {
    label: "Hapus Aduan",
    icon: <FaTrash />,
    color: "bg-red-600 hover:bg-red-700",
    modal: "hapus",
  },
};

const LaporanActionButtons = ({ user, laporan, handleOpenModal }) => {
  if (!user || !laporan) return null;

  const actions = getAvailableActions(user.role, laporan.status);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4 border-b pb-2">Tindakan</h3>
      <div className="flex gap-4 flex-wrap">
        {actions.map((action) => {
          const btn = actionButtons[action];
          return (
            <button
              key={action}
              onClick={() => handleOpenModal(btn.modal)}
              className={`flex items-center gap-2 ${btn.color} text-white px-4 py-2 rounded-full text-sm shadow`}
            >
              {btn.icon}
              {btn.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LaporanActionButtons;
