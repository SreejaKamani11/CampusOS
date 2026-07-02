import { useEffect, useState } from "react";

import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/canteen.service";
import { toast } from "react-toastify";

const CanteenCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await getAdminCategories();
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async () => {
    try {
      await createCategory({
        name,
        sortOrder: Number(sortOrder),
      });

      setName("");
      setSortOrder("");

      loadCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create category.");
    }
  };

  const handleEdit = async (category) => {
    const newName = prompt("Category Name", category.name);
    if (newName === null) return;

    const newSort = prompt("Sort Order", category.sort_order);
    if (newSort === null) return;

    try {
      await updateCategory(category.id, {
        name: newName,
        sortOrder: Number(newSort),
      });

      loadCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update category.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete category?")) return;

    try {
      await deleteCategory(id);
      loadCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete category.");
    }
  };

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Canteen Categories
        </h1>

      </div>

      <div className="flex gap-3 mb-6">

        <input
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded p-2"
        />

        <input
          placeholder="Sort Order"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border rounded p-2"
        />

        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Add
        </button>

      </div>

      <table className="w-full bg-white rounded shadow">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-3 text-left">Name</th>

            <th className="p-3 text-left">Sort Order</th>

            <th className="p-3 text-left">Actions</th>

          </tr>

        </thead>

        <tbody>

          {categories.map((category) => (

            <tr key={category.id} className="border-t">

              <td className="p-3">
                {category.name}
              </td>

              <td className="p-3">
                {category.sort_order}
              </td>

              <td className="p-3 flex gap-2">

                <button
                  onClick={() => handleEdit(category)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(category.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default CanteenCategoriesPage;