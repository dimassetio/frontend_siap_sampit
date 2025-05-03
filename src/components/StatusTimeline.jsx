import React from "react";
import { formatDate } from "../utils/dateformatter";


const getStatusColor = (status) => {
  switch (status) {
    case "selesai":
      return "green";
    case "diproses":
      return "blue";
    case "dibatalkan":
      return "red";
    default:
      return "yellow";
  }
};

const StatusTimeline = ({ items }) => {
  return (
    <div className="relative flex flex-col  pl-1 md:pl-3">
      {items.map((item, index) => (
        <div key={index} className="relative flex gap-4">
          {/* Titik dan Garis */}
          <div className="flex flex-col items-center">
            <div className={`w-4 h-4 rounded-full bg-${getStatusColor(item.status)}-500 z-10  shadow mt-1`} />
            {index < items.length - 1 && <div className="w-px bg-gray-300 flex-1 mt-0.5" />}
          </div>

          {/* Konten */}
          <div className="flex flex-col mb-3 md:mb-5">
            <div className={`font-bold text-${getStatusColor(item.status)}-600`}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </div>
            <div className="text-sm text-gray-700">
              oleh <span className="font-medium">{item.updatedBy.name}</span> pada {formatDate(item.updatedAt)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusTimeline;
