import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  updateCartItem,
  removeFromCart,
  checkout,
} from "../../services/cart.service";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";

function CartPage() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const response = await getCart();

      setCartItems(response.data?.items || []);
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleIncrease = async (item) => {
    try {
      await updateCartItem(item.id, item.quantity + 1);
      toast.success("Quantity updated");
      fetchCart();
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Failed to increase quantity");
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity === 1) {
      return handleRemove(item.id);
    }

    try {
      await updateCartItem(item.id, item.quantity - 1);
      toast.success("Quantity updated");
      fetchCart();
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Failed to decrease quantity");
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);

      toast.success("Item removed");

      fetchCart();
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Failed to remove item");
    }
  };

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);

      await checkout();

      toast.success("Order placed successfully!");

      navigate("/orders");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (cartItems.length === 0) {
    return <EmptyState title="Your Cart is Empty" />;
  }

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.quantity * Number(item.unit_price),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100 px-4 py-6">
      <div className="mx-auto max-w-5xl">

        <header className="mb-8 rounded-3xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold">
            Shopping Cart
          </h1>

          <p className="mt-2 text-slate-500">
            Review your selected items.
          </p>
        </header>

        <div className="space-y-4">

          {cartItems.map((item) => {

            const subtotal =
              item.quantity * Number(item.unit_price);

            const itemName =
              item.service_type === "canteen"
                ? item.menu_item?.name
                : item.product?.name;

            return (

              <div
                key={item.id}
                className="rounded-3xl bg-white p-6 shadow"
              >

                <div className="flex justify-between">

                  <h2 className="text-xl font-semibold">
                    {itemName}
                  </h2>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700 capitalize">
                    {item.service_type}
                  </span>

                </div>

                <p className="mt-3">
                  Quantity : {item.quantity}
                </p>

                <p>
                  Unit Price : ₹{Number(item.unit_price).toFixed(2)}
                </p>

                <p className="font-semibold">
                  Subtotal : ₹{subtotal.toFixed(2)}
                </p>

                <div className="mt-5 flex gap-3">

                  <button
                    onClick={() => handleIncrease(item)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                  >
                    +
                  </button>

                  <button
                    onClick={() => handleDecrease(item)}
                    className="rounded-lg bg-yellow-500 px-4 py-2 text-white"
                  >
                    -
                  </button>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-white"
                  >
                    Remove
                  </button>

                </div>

              </div>

            );
          })}

        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-sm text-slate-500">
                Total Price
              </p>

              <p className="text-3xl font-bold">
                ₹{totalPrice.toFixed(2)}
              </p>

            </div>

            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="rounded-xl bg-blue-600 px-6 py-3 text-white disabled:opacity-50"
            >
              {checkoutLoading
                ? "Placing Order..."
                : "Checkout"}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default CartPage;