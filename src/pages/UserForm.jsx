import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { toast } from "react-toastify";

export default function UserForm() {
  const { id } = useParams(); // dapatkan parameter ID dari URL
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const API_URL = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    id: "",
    nim: "",
    nama: "",
    email: "",
    noHp: "",
    role: "mahasiswa",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Ambil data user jika id tersedia (Edit Mode)
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      const token = localStorage.getItem("token");

      fetch(`${API_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            id: data._id,
            nim: data.nim,
            nama: data.name,
            email: data.email,
            noHp: data.phone,
            role: data.role,
          });
        })
        .catch((err) => console.error("Gagal fetch data user:", err))
        .finally(() => setLoading(false));
    }
  }, [id, isEditMode, API_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = isEditMode ? "PUT" : "POST";
      const endpoint = isEditMode
        ? `${API_URL}/users/${id}`
        : `${API_URL}/users`;

      const token = localStorage.getItem("token"); // Ambil token dari localStorage
      const bodyData = {
        nim: formData.nim,
        name: formData.nama,
        email: formData.email,
        phone: formData.noHp,
        role: formData.role,
      };

      // Hanya sertakan password kalau tidak kosong (saat edit)
      if (!isEditMode || formData.password !== "") {
        bodyData.password = formData.password;
      }
      console.log(JSON.stringify(bodyData));
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Tambahkan header Authorization
        },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");

      navigate("/admin/users");
      toast.success('Berhasil menyimpan user');
    } catch (error) {
      console.error(error.message);
      alert("Terjadi kesalahan saat menyimpan data");
    }
  };


  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">
          {isEditMode ? "Edit User" : "Tambah User"}
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow space-y-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">NIM / ID</label>
                <input
                  type="text"
                  name="nim"
                  value={formData.nim}
                  onChange={handleChange}
                  required
                  disabled={isEditMode}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nama</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={isEditMode ? "Biarkan kosong jika tidak ingin mengubah password" : ""}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  required={!isEditMode} // wajib isi kalau bukan edit
                />
              </div>


              <div>
                <label className="block text-sm font-medium mb-1">No. HP</label>
                <input
                  type="tel"
                  name="noHp"
                  value={formData.noHp}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div >
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="mahasiswa">Mahasiswa</option>
                  <option value="admin">Admin</option>
                  <option value="petugas">Petugas</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm shadow"
              >
                {isEditMode ? "Simpan Perubahan" : "Tambah User"}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
