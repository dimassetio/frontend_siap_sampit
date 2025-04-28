import { FaCheckCircle, FaClipboardList, FaCog, FaHourglassHalf } from "react-icons/fa";

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

export default DashboardStats;