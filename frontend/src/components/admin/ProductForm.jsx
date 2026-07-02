import { useEffect, useState } from "react";

const initialState = {
  categoryId: "",
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
  active: true,
};

const ProductForm = ({
  open,
  onClose,
  onSubmit,
  product,
  categories,
}) => {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (product) {
      setForm({
        categoryId: product.category_id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.image_url || "",
        active: product.active,
      });
    } else {
      setForm(initialState);
    }
  }, [product]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl shadow-lg w-[500px] p-6">

        <h2 className="text-2xl font-bold mb-5">
          {product ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            name="imageUrl"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <label className="flex items-center gap-2">

            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />

            Active Product

          </label>

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              {product ? "Update" : "Create"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default ProductForm;