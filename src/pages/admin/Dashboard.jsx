import { useState, useEffect } from "react";
import { FaClipboardList, FaHourglassHalf, FaCheckCircle, FaUsers, FaEye } from "react-icons/fa";
import LaporanLineChart from "../../components/LaporanLineChart";
import AdminLayout from "../../layouts/AdminLayout";
import axios from "axios"; // Import axios for data fetching
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/dateformatter";
import DashboardStats from "../../components/DashboardStats";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    menunggu: 0,
    diproses: 0,
    selesai: 0
  });

  const [totalReports, setTotalReports] = useState(0);
  const [latestReports, setLatestReports] = useState([]);
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  // Fetching the statistics, latest reports, and chart data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching latest reports
        const reportsResponse = await axios.get("/api/reports?limit=5"); // Adjust with correct endpoint
        setLatestReports(reportsResponse.data.data);
        setSummary(reportsResponse.data.summary);
        setTotalReports(reportsResponse.data.totalItems);

        // Fetching chart data
        const chartResponse = await axios.get("/api/reports/weekly-chart", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }); // Adjust with correct endpoint
        setChartData(chartResponse.data); // Assuming the response returns the chart data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Selamat datang di Dashboard Admin</h2>

        <DashboardStats summary={summary} totalReports={totalReports} />

        {/* Chart */}
        <div className="bg-white rounded shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Statistik Laporan Mingguan</h3>
          <LaporanLineChart data={chartData} />
        </div>

        {/* Latest Reports Table */}
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Laporan Terbaru</h3>
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="text-sm text-gray-600 border-b">
                <th className="py-2">No</th>
                <th className="py-2">Judul</th>
                <th className="py-2">Status</th>
                <th className="py-2">Pelapor</th>
                <th className="py-2">Tanggal</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {latestReports && latestReports.map((laporan, i) => (
                <tr key={laporan.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{i + 1}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
