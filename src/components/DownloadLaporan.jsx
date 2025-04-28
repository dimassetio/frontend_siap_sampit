import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FaDownload } from 'react-icons/fa';

const DownloadLaporan = () => {
  const [loading, setLoading] = useState(false);

  // Function to fetch reports and immediately download as Excel
  const handleFetchAndDownload = async () => {
    setLoading(true);
    try {
      // Fetch data from the API
      const response = await axios.get('/api/reports'); // Adjust the API endpoint as needed
      const laporanList = response.data.data;
      const transformedData = laporanList.map(report => {
        // Get the user name from userId
        const userName = report.userId ? report.userId.name : 'Unknown';

        // If there is a handledBy field, we do the same for handledBy
        const handledByName = report.statusHistory.length > 0
          ? report.statusHistory[report.statusHistory.length - 1].updatedBy.name // Assuming 'updatedBy' has 'name'
          : 'Unknown';

        return {
          ...report, // Keep the original report data
          userName,   // Replace userId with userName
          handledByName,  // Add handledBy with the last updatedBy's name
        };
      });

      // Convert the transformed data to Excel and trigger download
      const ws = XLSX.utils.json_to_sheet(transformedData); // Convert to sheet
      const wb = XLSX.utils.book_new(); // Create a new workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Reports'); // Add sheet to workbook
      XLSX.writeFile(wb, 'laporan.xlsx'); // Trigger download
    } catch (error) {
      console.error('Error fetching or downloading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg shadow flex items-center gap-2"
      onClick={loading ? null : handleFetchAndDownload}
    >
      <FaDownload className="text-white" />
      {loading ? 'Loading...' : 'Download Laporan'}
    </button>
  );
};

export default DownloadLaporan;
