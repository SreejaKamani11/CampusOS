import { useEffect, useState } from "react";

import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/stationery.service";
import { toast } from "react-toastify";

const StationeryCategoriesPage = () => {

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const response = await getAdminCategories();
    setCategories(response.data);
  };

  const handleAdd = async () => {

    if (!name) return;

    await createCategory({
      name,
      sortOrder: Number(sortOrder),
    });

    setName("");
    setSortOrder("");

    loadCategories();
  };

  const handleDelete = async (id) => {
  try {
    await deleteCategory(id);

    toast.success("Category deleted successfully");

    loadCategories();
  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message ||
      "Unable to delete category"
    );
  }
};

  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Stationery Categories
      </h1>

      <div className="flex gap-3 mb-6">

        <input
          placeholder="Category Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          placeholder="Sort Order"
          value={sortOrder}
          onChange={(e)=>setSortOrder(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Add
        </button>

      </div>

      <table className="w-full bg-white shadow rounded">

        <thead>

          <tr>

            <th>Name</th>

            <th>Sort Order</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {categories.map((category)=>(

            <tr key={category.id}>

              <td>{category.name}</td>

              <td>{category.sort_order}</td>

              <td>

                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={()=>handleDelete(category.id)}
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

export default StationeryCategoriesPage;