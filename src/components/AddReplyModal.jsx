import React, { useState } from 'react';

const AddReplyModal = ({ reportId, onClose, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem("user"));
  const senderId = user._id;
  const senderRole = user.role;


  const handleSendReply = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);
      const method = "POST";
      const bodyData = {
        senderId,
        senderRole,
        message
      };

      console.log(bodyData);
      // Data yang dikirim sesuai dengan backend yang kamu buat
      const res = await fetch(`${process.env.REACT_APP_API_URL}/reports/${reportId}/reply`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(bodyData)
      });
      console.log(res);
      if (!res.ok) throw new Error('Gagal mengirim tanggapan');

      const data = await res.json();
      onSuccess && onSuccess(data); // update atau reload data laporan
      setMessage('');
      onClose(); // tutup modal
    } catch (err) {
      setError(err.message);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div>
    //   <h3 className="text-lg font-semibold mb-4">Tanggapan</h3>
    //   <textarea rows={4} className="w-full border p-2 rounded" placeholder="Masukkan tanggapan Anda..." />
    //   <div className="text-right mt-4">
    //     <button onClick={handleCloseModal} className="bg-blue-600 text-white px-4 py-2 rounded">Kirim</button>
    //   </div>
    // </div>
    <div>
      <h3 className="text-lg font-semibold mb-4">Tanggapan</h3>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <textarea
        rows={4}
        className="w-full border p-2 rounded"
        placeholder="Masukkan tanggapan Anda..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="text-right mt-4">
        <button
          onClick={handleSendReply}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Mengirim...' : 'Kirim'}
        </button>
      </div>
    </div>
  );
};

export default AddReplyModal;
