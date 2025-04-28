import { FaSpinner } from 'react-icons/fa';

export default function ModalLoading() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <FaSpinner className="text-white text-5xl animate-spin mb-4" />
        <p className="text-white text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
}
