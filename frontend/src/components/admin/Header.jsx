import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">

      <h1 className="text-2xl font-semibold">
        Admin Panel
      </h1>

      <div className="flex items-center gap-6">

        <div className="text-right">
          <p className="font-semibold">
            {user?.name}
          </p>

          <p className="text-sm text-gray-500 capitalize">
            {user?.role}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

    </header>
  );
};

export default Header;