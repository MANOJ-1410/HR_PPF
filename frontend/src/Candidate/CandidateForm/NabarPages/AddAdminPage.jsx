import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "../../../backendUrl";

const addAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showForm, setShowForm] = useState(false);

  // Base URL for API
  const API_BASE_URL = `${backendUrl}/api/addAdmin/`;

  // Fetch admins from the database
  const fetchaddAdmin = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setAdmins(response.data);
    } catch (err) {
      toast.error("Error fetching admins!");
      console.error("Error fetching admins:", err);
    }
  };

  // Add a new admin
  const handleAddAdmin = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill all the fields!");
      return;
    }

    try {
      const response = await axios.post(API_BASE_URL, formData);
      setAdmins([...admins, response.data]);
      toast.success("Admin added successfully!");
      setFormData({ name: "", email: "", password: "" });
      setShowForm(false);
    } catch (err) {
      toast.error("Failed to add admin!");
      console.error("Error adding admin:", err);
    }
  };

  // Delete an admin
  const handledeleteaddAdmin = async (id) => {
    try {
      console.log("Deleting Admin at:", `${API_BASE_URL}/${id}`); // Debugging
  
      const response = await axios.delete(`${API_BASE_URL}/${id}`); // Added `/` before id
  
      setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin._id !== id));
  
      toast.success("Admin deleted successfully!");
    } catch (err) {
      toast.error("Error deleting admin!");
      console.error("Error deleting admin:", err);
      if (err.response && err.response.status === 404) {
        alert("Admin not found.");
      } else {
        alert("An error occurred while deleting the admin.");
      }
    }
  };
  

  useEffect(() => {
    fetchaddAdmin();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          ADD ADMIN
        </h2>

        {/* Add Admin Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition"
          >
            <AiOutlineUserAdd className="text-2xl" />
            {showForm ? "Cancel" : "Add Admin"}
          </button>
        </div>

        {/* Expandable Form */}
        {showForm && (
          <form onSubmit={handleAddAdmin} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Admin Name"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Admin Email"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-green-700 transition"
            >
              Add Admin
            </button>
          </form>
        )}

        {/* Admin List */}
        {admins.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              Admins List
            </h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="border border-gray-300 p-3 text-left">Name</th>
                  <th className="border border-gray-300 p-3 text-left">Email</th>
                  <th className="border border-gray-300 p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, index) => (
                  <tr key={index} className="hover:bg-gray-100 transition">
                    <td className="border border-gray-300 p-3">{admin.name}</td>
                    <td className="border border-gray-300 p-3">{admin.email}</td>
                    <td className="border border-gray-300 p-3">
                      <button
                        onClick={() => handledeleteAdmin(admin._id)}
                        className="flex items-center gap-2 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-red-700 transition"
                      >
                        <FiTrash2 />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default addAdmin;
