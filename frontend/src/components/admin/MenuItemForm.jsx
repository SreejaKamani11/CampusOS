import { useEffect, useState } from "react";

const initialState = {
  categoryId: "",
  name: "",
  description: "",
  price: "",
  available: true,
  mealPeriods: [],
};

const periods = [
  "breakfast",
  "lunch",
  "snacks",
  "dinner",
  "beverages",
];

export default function MenuItemForm({
  open,
  onClose,
  onSubmit,
  menuItem,
  categories,
}) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (menuItem) {
      setForm({
        categoryId: menuItem.category_id,
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        available: menuItem.available,
        mealPeriods: menuItem.meal_periods || [],
      });
    } else {
      setForm(initialState);
    }
  }, [menuItem]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (name === "mealPeriods") {
      let arr = [...form.mealPeriods];

      if (checked)
        arr.push(value);
      else
        arr = arr.filter((p) => p !== value);

      setForm({
        ...form,
        mealPeriods: arr,
      });

      return;
    }

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white rounded-xl w-[550px] p-6">

        <h2 className="text-2xl font-bold mb-5">

          {menuItem
            ? "Edit Menu Item"
            : "Add Menu Item"}

        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
          className="space-y-4"
        >

          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          >

            <option value="">
              Select Category
            </option>

            {categories.map((c) => (

              <option
                key={c.id}
                value={c.id}
              >
                {c.name}
              </option>

            ))}

          </select>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border p-3 rounded"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-3 rounded"
          />

          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full border p-3 rounded"
          />

          <div>

            <h3 className="font-semibold mb-2">
              Meal Periods
            </h3>

            <div className="grid grid-cols-2 gap-2">

              {periods.map((period) => (

                <label
                  key={period}
                  className="flex gap-2"
                >

                  <input
                    type="checkbox"
                    name="mealPeriods"
                    value={period}
                    checked={form.mealPeriods.includes(period)}
                    onChange={handleChange}
                  />

                  {period}

                </label>

              ))}

            </div>

          </div>

          <label className="flex gap-2">

            <input
              type="checkbox"
              name="available"
              checked={form.available}
              onChange={handleChange}
            />

            Available

          </label>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              className="bg-blue-600 text-white px-5 py-2 rounded"
            >
              {menuItem ? "Update" : "Create"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}