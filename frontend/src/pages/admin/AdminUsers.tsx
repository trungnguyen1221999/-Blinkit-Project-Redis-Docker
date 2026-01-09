import { Pencil, Trash2, Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import deleteUserApi from "../../api/adminApi/deleteUserApi";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";
import DeletePopup from "../../components/DeletePopup";
import addUserApi from "../../api/adminApi/addUserApi";
import AddUserPopup from "../../components/AddUserPopupProps";
import EditUserPopup, {
  type EditUserFormData,
} from "../../components/EditUserPopup";
import editUserApi from "../../api/adminApi/editUserApi";
import { getAllUserApi } from "../../api/adminApi/getAllUserApi";

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [roleFilter, setRoleFilter] = useState<"All" | "Admin" | "User">("All");
  const [neededRerender, setNeededRerender] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [usersToDelete, setUsersToDelete] = useState<string[]>([]);
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUserApi();
        setUsers(data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [neededRerender]);

  // Filter by role
  const filteredUsers =
    roleFilter === "All"
      ? users
      : users.filter((u) => u.role.toLowerCase() === roleFilter.toLowerCase());

  // Pagination setup
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  // ADD USER
  const addUserMutation = useMutation({
    mutationFn: async (userData: {
      name: string;
      email: string;
      password: string;
      role: "ADMIN" | "USER";
    }) => await addUserApi(userData),
    onSuccess: () => {
      toast.success("User added successfully");
      setShowAddUserPopup(false);
      setNeededRerender((p) => !p);
    },
    onError: (error: any) => {
      toast.error(error.response?.data.message || "Failed to add user");
    },
  });

  const handleAddUser = (userData: {
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "USER";
  }) => addUserMutation.mutate(userData);

  // DELETE USER
  const deleteUserMutation = useMutation({
    mutationFn: async (ids: string | string[]) => {
      if (Array.isArray(ids))
        await Promise.all((Array.isArray(ids) ? ids : []).map((_id) => deleteUserApi(_id)));
      else await deleteUserApi(ids);
    },
    onSuccess: () => {
      toast.success("User(s) deleted successfully");
      setSelectedUsers([]);
      setSelectAll(false);
      setShowDeletePopup(false);
      setNeededRerender((p) => !p);
    },
    onError: () => {
      toast.error("Failed to delete user(s)");
      setShowDeletePopup(false);
    },
  });

  const confirmDeleteUser = (id: string) => {
    setUsersToDelete([id]);
    setShowDeletePopup(true);
  };

  const confirmDeleteSelected = () => {
    if (selectedUsers.length === 0) return;
    setUsersToDelete(selectedUsers);
    setShowDeletePopup(true);
  };

  // SELECT logic
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
      setSelectAll(false);
    } else {
      setSelectedUsers((Array.isArray(currentUsers) ? currentUsers : []).map((u) => u._id));
      setSelectAll(true);
    }
  };

  const handleSelectUser = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const allSelected =
      currentUsers.length > 0 &&
      currentUsers.every((u) => selectedUsers.includes(u._id));
    setSelectAll(allSelected);
  }, [currentUsers, selectedUsers]);

  // EDIT USER
  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setShowEditPopup(true);
  };

  const updateUserMutation = useMutation({
    mutationFn: async ({
      _id,
      data,
    }: {
      _id: string;
      data: EditUserFormData;
    }) => await editUserApi(_id, data),
    onSuccess: () => {
      toast.success("User updated successfully");
      setShowEditPopup(false);
      setNeededRerender((p) => !p);
    },
    onError: () => toast.error("Failed to update user"),
  });

  return (
    <div className="p-2 md:p-8 space-y-6">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">User Management</h1>
            <p className="text-slate-600">Manage system users and their permissions</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Total Users: <strong className="text-slate-700">{users.length}</strong>
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Active: <strong className="text-slate-700">{users.filter(u => u.status === 'Active').length}</strong>
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
            {/* Filter Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Filter by Role</label>
              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value as "All" | "Admin" | "User")
                }
                className="min-w-[140px] border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200/20 focus:border-primary-200 transition-colors bg-white shadow-sm h-[42px]"
              >
                <option value="All">All Roles</option>
                <option value="Admin">Administrators</option>
                <option value="User">Users</option>
              </select>
            </div>

            {/* Add User Button */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-slate-600 uppercase tracking-wide opacity-0">Action</label>
              <button
                onClick={() => setShowAddUserPopup(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-200 to-primary-100 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium h-[42px]"
              >
                <Plus size={18} />
                <span>Create User</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SELECTED INFO */}
      {selectedUsers.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">{selectedUsers.length}</span>
              </div>
              <div>
                <p className="font-semibold text-slate-800">
                  {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""} selected
                </p>
                <p className="text-xs text-slate-500">Choose an action to perform on selected users</p>
              </div>
            </div>
            <button
              onClick={confirmDeleteSelected}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 hover:shadow-lg transition-all duration-200 font-medium"
            >
              <Trash2 size={16} />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto rounded-xl shadow-md bg-white">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <th className="p-4 text-center font-semibold text-slate-700 w-16">#</th>
                <th className="p-4 text-center font-semibold text-slate-700 w-12">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-primary-200 bg-gray-100 border-gray-300 rounded focus:ring-primary-200 focus:ring-2"
                    />
                  </div>
                </th>
                <th className="p-4 text-left font-semibold text-slate-700">User</th>
                <th className="p-4 text-left font-semibold text-slate-700">Contact</th>
                <th className="p-4 text-left font-semibold text-slate-700">Role</th>
                <th className="p-4 text-left font-semibold text-slate-700">Status</th>
                <th className="p-4 text-left font-semibold text-slate-700">Verification</th>
                <th className="p-4 text-left font-semibold text-slate-700">Joined</th>
                <th className="p-4 text-center font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {(Array.isArray(currentUsers) ? currentUsers : []).map((user, idx) => (
                <tr
                  key={user._id}
                  className={`hover:bg-slate-50 transition-all duration-200 group ${
                    user.verify_email ? "bg-green-50/30" : ""
                  }`}
                >
                  <td className="p-4 text-center font-medium text-slate-600">
                    {startIndex + idx + 1}
                  </td>
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                      className="w-4 h-4 text-primary-200 bg-gray-100 border-gray-300 rounded focus:ring-primary-200 focus:ring-2"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 object-cover rounded-full border-2 border-white shadow-sm"
                        />
                        {user.verify_email && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500">ID: {user._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-slate-800 font-medium">{user.email}</p>
                      <p className="text-xs text-slate-500">Primary contact</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {user.verify_email ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                          ⏳ Pending
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">
                    <div>
                      <p className="font-medium">{new Date(user.createdAt).toLocaleDateString("en-US")}</p>
                      <p className="text-xs text-slate-500">{new Date(user.createdAt).toLocaleDateString("en-US", { weekday: 'short' })}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 text-slate-400 hover:text-primary-200 hover:bg-primary-50 rounded-lg transition-all duration-200 group-hover:scale-110"
                        title="Edit user"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => confirmDeleteUser(user._id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 group-hover:scale-110"
                        title="Delete user"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* EMPTY STATE */}
      {currentUsers.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No users found</h3>
          <p className="text-slate-500 mb-6">
            {roleFilter === 'All' 
              ? "There are no users in the system yet." 
              : `No users found with role: ${roleFilter}`
            }
          </p>
          {roleFilter === 'All' && (
            <button
              onClick={() => setShowAddUserPopup(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-200 to-primary-100 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
            >
              <Plus size={18} />
              Create First User
            </button>
          )}
        </div>
      )}

      {/* POPUPS */}
      {showDeletePopup && (
        <DeletePopup
          count={usersToDelete.length}
          onCancel={() => setShowDeletePopup(false)}
          onConfirm={() => deleteUserMutation.mutate(usersToDelete)}
        />
      )}

      {showAddUserPopup && (
        <AddUserPopup
          onCancel={() => setShowAddUserPopup(false)}
          onConfirm={handleAddUser}
        />
      )}

      {showEditPopup && editingUser && (
        <EditUserPopup
          user={editingUser}
          onCancel={() => setShowEditPopup(false)}
          onConfirm={(data) =>
            updateUserMutation.mutate({ _id: editingUser._id, data })
          }
        />
      )}
    </div>
  );
};

export default AdminUsers;
