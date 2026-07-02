import { useEffect, useState } from "react";

import MenuItemForm from "../../components/admin/MenuItemForm";

import {
  getAdminMenu,
  getAdminCategories,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateAvailability,
} from "../../services/canteen.service";
import { toast } from "react-toastify";

const CanteenAdminPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const menuResponse = await getAdminMenu();
      const categoryResponse = await getAdminCategories();

      setMenuItems(menuResponse.data);
      setCategories(categoryResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async (data) => {
    try {
      await createMenuItem(data);

      setOpen(false);

      loadData();

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to create menu item.");
    }
  };

  const handleEdit = async (data) => {
    try {
      await updateMenuItem(editingItem.id, data);

      setEditingItem(null);

      setOpen(false);

      loadData();

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to update menu item.");
    }
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete menu item?")) return;

    try {

      await deleteMenuItem(id);

      loadData();

    } catch (error) {

      toast.error(error.response?.data?.message || "Unable to delete.");

    }

  };

  const handleAvailability = async (item) => {

    try {

      await updateAvailability(item.id, !item.available);

      loadData();

    } catch (error) {

      console.error(error);

    }

  };

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Canteen Menu Management
        </h1>

        <button
          onClick={() => {
            setEditingItem(null);
            setOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add Menu Item
        </button>

      </div>

      <table className="w-full bg-white rounded-lg shadow">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-3 text-left">Name</th>

            <th className="p-3 text-left">Category</th>

            <th className="p-3 text-left">Price</th>

            <th className="p-3 text-left">Available</th>

            <th className="p-3 text-left">Actions</th>

          </tr>

        </thead>

        <tbody>

          {menuItems.map((item) => (

            <tr key={item.id} className="border-t">

              <td className="p-3">{item.name}</td>

              <td className="p-3">{item.category_name}</td>

              <td className="p-3">₹{item.price}</td>

              <td className="p-3">

                {item.available ? "Available" : "Unavailable"}

              </td>

              <td className="p-3 flex gap-2">

                <button
                  onClick={() => {
                    setEditingItem(item);
                    setOpen(true);
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

                <button
                  onClick={() => handleAvailability(item)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  {item.available ? "Disable" : "Enable"}
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <MenuItemForm
        open={open}
        menuItem={editingItem}
        categories={categories}
        onClose={() => {
          setOpen(false);
          setEditingItem(null);
        }}
        onSubmit={
          editingItem
            ? handleEdit
            : handleCreate
        }
      />

    </div>
  );
};

export default CanteenAdminPage;