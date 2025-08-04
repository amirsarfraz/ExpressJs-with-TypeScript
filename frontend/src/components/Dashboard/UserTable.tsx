import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar.tsx";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsers,
  updateUser,
  deleteUser as deleteUserAction,
  User,
} from "../../redux/usersSlice.ts";
import { RootState, AppDispatch } from "../../redux";
import ConfirmModal from "../Model/ConfirmModal.tsx";
import SimpleToast from "../Model/SimpleSnackbar.tsx";
import Sidebar from "../Sidebar/Sidebar.tsx";
import Footer from "../Footer/footer.tsx";

const roles = ["user", "manager", "admin"];

const UserTable = () => {
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success"
  );
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector((state: RootState) => state.users);

  const openModal = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleEditClick = (user: User) => {
    if (user.role === "user") {
      setToastMessage("Editing users with role 'user' is not allowed.");
      setToastType("error");
      return;
    }
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
      await dispatch(updateUser({ id, data: editedUser }));
      setEditUserId(null);
      setToastMessage("User updated successfully.");
      setToastType("success");
    } catch (err) {
      console.error(err);
      setToastMessage("Failed to update user.");
      setToastType("error");
    }
  };

  const deleteUser = async () => {
    if (!selectedUserId) return;
    try {
      await dispatch(deleteUserAction(selectedUserId));
      setIsModalOpen(false);
      setToastMessage("User deleted successfully.");
      setToastType("success");
    } catch (err) {
      console.error("Delete failed:", err);
      setToastMessage("Delete failed.");
      setToastType("error");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex flex-col flex-1">
          {/* Navbar */}
          <Navbar />

          {/* Toast message */}
          {toastMessage && (
            <SimpleToast
              message={toastMessage}
              type={toastType}
              onClose={() => setToastMessage(null)}
            />
          )}

          {/* Page content */}
          <main className="flex-1 p-4 overflow-x-auto bg-gray-50">
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
                            onChange={(e) =>
                              handleChange("email", e.target.value)
                            }
                            className="border px-2 py-1 w-full"
                          />
                        ) : (
                          user.email
                        )}
                      </td>
                      <td className="border px-4 py-2">
                        {isEditing ? (
                          editedUser.role === "user" ? (
                            <span>{user.role}</span>
                          ) : (
                            <select
                              value={editedUser.role || "user"}
                              onChange={(e) =>
                                handleChange("role", e.target.value)
                              }
                              className="border px-2 py-1 w-full"
                            >
                              {roles.map((role) => (
                                <option key={role} value={role}>
                                  {role.charAt(0).toUpperCase() + role.slice(1)}
                                </option>
                              ))}
                            </select>
                          )
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
          </main>
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default UserTable;
