import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar.tsx";
import axios from "axios";
import ConfirmModal from "../Model/ConfirmModal.tsx";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

const roles = ["user", "manager", "admin"];

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetch("http://localhost:3000/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setLoading(false);
      });
  }, []);

  const handleEditClick = (user: User) => {
    setEditUserId(user.id);
    setEditedUser({ ...user });
  };

  const handleChange = (field: keyof User, value: string) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveClick = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUser),
      });

      if (!res.ok) throw new Error("Failed to update user");

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? ({ ...user, ...editedUser } as User) : user
        )
      );
      setEditUserId(null);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };
  const deleteUser = async () => {
    if (!selectedUserId) return;
    try {
      await axios.delete(`http://localhost:3000/api/users/${selectedUserId}`);
      setUsers((prev) => prev.filter((u) => u.id !== selectedUserId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="p-4 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Registered Users</h2>
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">ID</th>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Email</th>
              <th className="border px-4 py-2 text-left">Role</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isEditing = editUserId === user.id;

              return (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{user.id}</td>
                  <td className="border px-4 py-2">
                    {isEditing ? (
                      <input
                        value={editedUser.username || ""}
                        onChange={(e) =>
                          handleChange("username", e.target.value)
                        }
                        className="border px-2 py-1 w-full"
                      />
                    ) : (
                      user.username
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {isEditing ? (
                      <input
                        value={editedUser.email || ""}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="border px-2 py-1 w-full"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {isEditing ? (
                      <select
                        value={editedUser.role || "user"}
                        onChange={(e) => handleChange("role", e.target.value)}
                        className="border px-2 py-1 w-full"
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    {isEditing ? (
                      <button
                        onClick={() => handleSaveClick(user.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick(user)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                    )}

                    <button
                      onClick={() => openModal(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                    {/* Only one modal outside the map loop */}
                    {selectedUserId === user.id && (
                      <ConfirmModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={deleteUser}
                        message="Are you sure you want to delete this user?"
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserTable;
