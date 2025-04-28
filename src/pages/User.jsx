import { useEffect, useState } from "react";
import { FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import AdminLayout from "../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function UserIndex() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);



  const handleDelete = async (userId, userName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete user ${userName}?`);
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("User successfully deleted");
        fetchUsers(); // Refresh users
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700";
      case "petugas":
        return "bg-blue-100 text-blue-700";
      case "mahasiswa":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <AdminLayout>
      <div className="container w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">User Data</h2>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg shadow flex items-center gap-2"
            onClick={() => {
              navigate("/admin/users/create");
            }}
          >
            <FaPlus className="text-white" />
            Add User
          </button>
        </div>

        <div className="bg-white rounded shadow p-6 overflow-x-auto">
          {loading ? (
            <p>Loading user data...</p>
          ) : error ? (
            <div className="text-red-600 font-medium">{error}</div>
          ) : (
            <div className="overflow-x-auto max-w-full">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="py-3 hidden sm:table-cell">No</th>
                    <th className="py-3 hidden sm:table-cell">NIM / ID</th>
                    <th className="py-3">Name</th>
                    <th className="py-3 hidden sm:table-cell">Email</th>
                    <th className="py-3 hidden sm:table-cell">Phone</th>
                    <th className="py-3 ">Role</th>
                    <th className="py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 hidden sm:table-cell">{i + 1}</td>
                      <td className="py-3 hidden sm:table-cell font-mono">{user.nim}</td>
                      <td className="py-3">{user.name}</td>
                      <td className="py-3 hidden sm:table-cell">{user.email}</td>
                      <td className="py-3 hidden sm:table-cell">{user.phone}</td>
                      <td className="py-3 ">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeClass(user.role)}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/users/detail/${user._id}`)}
                            className="bg-blue-500 hover:bg-blue-600 p-2 rounded text-white"
                            title="Detail"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/users/edit/${user._id}`)}
                            className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded text-white"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id, user.name)}
                            className="bg-red-500 hover:bg-red-600 p-2 rounded text-white"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
