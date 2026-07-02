import { useEffect, useState } from "react";
import {
  getUsers,
  updateUserStatus,
  updateUserRole,
} from "../../services/admin.service";
import { useAuth } from "../../context/AuthContext";

const UsersPage = () => {
    const { user: loggedInUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (query = "") => {
    try {
      const response = await getUsers(query);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    loadUsers(value);
  };

  const handleStatus = async (user) => {
    await updateUserStatus(user.id, !user.active);
    loadUsers(search);
  };

  const handleRole = async (user) => {
    const newRole =
      user.role === "admin" ? "student" : "admin";

    await updateUserRole(user.id, newRole);
    loadUsers(search);
  };

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        User Management
      </h1>

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={handleSearch}
        className="border rounded-lg p-2 w-full mb-6"
      />

      <table className="w-full bg-white shadow rounded-lg overflow-hidden">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-3 text-left">Name</th>

            <th className="p-3 text-left">Email</th>

            <th className="p-3 text-left">Role</th>

            <th className="p-3 text-left">Status</th>

            <th className="p-3 text-left">Actions</th>

          </tr>

        </thead>

        <tbody>

          {users.map((user) => (

            <tr
              key={user.id}
              className="border-t"
            >

              <td className="p-3">{user.name}</td>

              <td className="p-3">{user.email}</td>

              <td className="p-3 capitalize">
                {user.role}
              </td>

              <td className="p-3">
                {user.active ? "Active" : "Disabled"}
              </td>

           <td className="p-3 flex gap-2">

    {loggedInUser.id !== user.id ? (
        <>
            <button
                onClick={() => handleStatus(user)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
            >
                {user.active ? "Disable" : "Enable"}
            </button>

            <button
                onClick={() => handleRole(user)}
                className="bg-green-600 text-white px-3 py-1 rounded"
            >
                Make {user.role === "admin" ? "Student" : "Admin"}
            </button>
        </>
    ) : (
        <span className="text-gray-500 italic">
            Current User
        </span>
    )}

</td>
            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default UsersPage;