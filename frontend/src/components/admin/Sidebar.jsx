import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaUtensils,
  FaPrint,
  FaClipboardList,
  FaFolder
} from "react-icons/fa";

const Sidebar = () => {
  const menu = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FaTachometerAlt />
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <FaUsers />
    },
    {
      name: "Stationery",
      path: "/admin/stationery",
      icon: <FaBoxOpen />
    },
    {
      name: "Stationery Categories",
      path: "/admin/stationery/categories",
      icon: <FaFolder />
    },
    {
      name: "Canteen",
      path: "/admin/canteen",
      icon: <FaUtensils />
    },
    {
      name: "Canteen Categories",
      path: "/admin/canteen/categories",
      icon: <FaFolder />
    },
    {
      name: "Print Jobs",
      path: "/admin/printjobs",
      icon: <FaPrint />
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <FaClipboardList />
    }
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white">
      <div className="text-2xl font-bold p-6 border-b border-gray-700">
        CampusOS
      </div>

      <nav className="mt-5">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 transition ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-gray-800"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;