import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { toast } from "react-toastify";

export default function LaporanForm() {
  const { id } = useParams(); // Get ID parameter from URL for edit mode
  const navigate = useNavigate();
  const isEditMode = Boolean(id); // Determine if in edit mode
  const API_URL = process.env.REACT_APP_API_URL;

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "", // Added category field for dropdown
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch data for edit mode (if ID is available)
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      const token = localStorage.getItem("token");

      fetch(`${API_URL}/reports/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setForm({
            title: data.title,
            description: data.description,
            category: data.category,
          });
          setPreviewUrl(data.image); // Set image preview if available
        })
        .catch((err) => console.error("Failed to fetch data:", err))
        .finally(() => setLoading(false));
    }
  }, [id, isEditMode, API_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);

      if (form.image) {
        formData.append("image", form.image); // Menambahkan image ke form data
      }

      const method = isEditMode ? "PUT" : "POST";
      const endpoint = isEditMode
        ? `${API_URL}/reports/${id}`
        : `${API_URL}/reports`;

      const token = localStorage.getItem("token");

      const res = await fetch(endpoint, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // Mengirim data dalam bentuk FormData
      });

      if (!res.ok) throw new Error("Failed to save data");

      navigate("/mahasiswa");
      toast.success(isEditMode ? "Laporan berhasil diperbarui" : "Laporan berhasil disimpan");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan data");
    }
  };


  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">{isEditMode ? "Edit Laporan" : "Tambah Laporan"}</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <form
            encType="multipart/form-data"
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Judul */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Masukkan judul laporan"
                  required
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Laporan</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  <option value="fasilitas">Fasilitas</option>
                  <option value="dosen">Dosen</option>
                  <option value="pelayanan">Pelayanan</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              {/* Deskripsi */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  rows={5}
                  placeholder="Tulis detail pengaduan"
                />
              </div>

              {/* Gambar */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar</label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0 file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mb-4"
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="rounded-lg border"
                    style={{ maxHeight: "120px", width: "auto" }}
                  />
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="text-right">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow"
              >
                {isEditMode ? "Simpan Perubahan" : "Simpan Laporan"}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
