import { useEffect, useState } from "react";

import ProductForm from "../../components/admin/ProductForm";

import {
  getAdminProducts,
  getAdminCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
} from "../../services/stationery.service";

const StationeryAdminPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const productResponse = await getAdminProducts();
      const categoryResponse = await getAdminCategories();

      setProducts(productResponse.data);
      setCategories(categoryResponse.data);

    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async (data) => {
    try {

      await createProduct(data);

      setOpen(false);

      loadData();

    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (data) => {
    try {

      await updateProduct(editingProduct.id, data);

      setEditingProduct(null);

      setOpen(false);

      loadData();

    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete Product?")) return;

    try {

      await deleteProduct(id);

      loadData();

    } catch (error) {

      console.error(error);

    }

  };

  const handleStock = async (product) => {

    const stock = prompt(
      "Enter New Stock",
      product.stock
    );

    if (stock === null) return;

    try {

      await updateStock(
        product.id,
        Number(stock)
      );

      loadData();

    } catch (error) {

      console.error(error);

    }

  };

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Stationery Management
        </h1>

        <button
          onClick={() => {
            setEditingProduct(null);
            setOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add Product
        </button>

      </div>

      <table className="w-full bg-white rounded-lg shadow">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-3 text-left">Name</th>

            <th className="p-3 text-left">Category</th>

            <th className="p-3 text-left">Price</th>

            <th className="p-3 text-left">Stock</th>

            <th className="p-3 text-left">Status</th>

            <th className="p-3 text-left">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {products.map((product) => (

            <tr
              key={product.id}
              className="border-t"
            >

              <td className="p-3">
                {product.name}
              </td>

              <td className="p-3">
                {product.category_name}
              </td>

              <td className="p-3">
                ₹{product.price}
              </td>

              <td className="p-3">
                {product.stock}
              </td>

              <td className="p-3">
                {product.active
                  ? "Active"
                  : "Inactive"}
              </td>

              <td className="p-3 flex gap-2">

                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setOpen(true);
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(product.id)
                  }
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

                <button
                  onClick={() =>
                    handleStock(product)
                  }
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Stock
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <ProductForm
        open={open}
        categories={categories}
        product={editingProduct}
        onClose={() => {
          setOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={
          editingProduct
            ? handleEdit
            : handleCreate
        }
      />

    </div>
  );
};

export default StationeryAdminPage;