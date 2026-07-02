import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
} from "../../services/orders.service";

const statuses = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "picked_up",
  "cancelled",
];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await getAllOrders();
      setOrders(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatus = async (order, status) => {
    try {
      await updateOrderStatus(order.id, status);
      loadOrders();

      if (selectedOrder?.id === order.id) {
        const details = await getOrderDetails(order.id);
        setSelectedOrder(details.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update order.");
    }
  };

  const handleView = async (id) => {
    try {
      const response = await getOrderDetails(id);
      setSelectedOrder(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const text = search.toLowerCase();

    return (
      order.order_number.toLowerCase().includes(text) ||
      order.service_type.toLowerCase().includes(text) ||
      order.status.toLowerCase().includes(text)
    );
  });

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Order Management
      </h1>

      <input
        className="border rounded p-2 mb-6 w-full"
        placeholder="Search orders..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="w-full bg-white shadow rounded">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-3 text-left">
              Order No
            </th>

            <th className="p-3 text-left">
              Service
            </th>

            <th className="p-3 text-left">
              Total
            </th>

            <th className="p-3 text-left">
              Status
            </th>

            <th className="p-3 text-left">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {filteredOrders.map((order) => (

            <tr
              key={order.id}
              className="border-t"
            >

              <td className="p-3">
                {order.order_number}
              </td>

              <td className="p-3 capitalize">
                {order.service_type}
              </td>

              <td className="p-3">
                ₹{order.total}
              </td>

              <td className="p-3">

                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatus(order, e.target.value)
                  }
                  className="border rounded p-2"
                >

                  {statuses.map((status) => (

                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>

                  ))}

                </select>

              </td>

              <td className="p-3">

                <button
                  onClick={() => handleView(order.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  View Details
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {selectedOrder && (

        <div className="mt-8 bg-white rounded shadow p-6">

          <div className="flex justify-between">

            <h2 className="text-2xl font-bold">
              Order Details
            </h2>

            <button
              onClick={() => setSelectedOrder(null)}
              className="text-red-600"
            >
              Close
            </button>

          </div>

          <div className="mt-4">

            <p>
              <strong>Order:</strong>{" "}
              {selectedOrder.order_number}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {selectedOrder.status}
            </p>

            <p>
              <strong>Service:</strong>{" "}
              {selectedOrder.service_type}
            </p>

            <p>
              <strong>Total:</strong> ₹
              {selectedOrder.total}
            </p>

          </div>

          <h3 className="font-bold mt-6 mb-3">
            Items
          </h3>

          <table className="w-full">

            <thead>

              <tr>

                <th className="text-left">
                  Name
                </th>

                <th className="text-left">
                  Qty
                </th>

                <th className="text-left">
                  Price
                </th>

                <th className="text-left">
                  Subtotal
                </th>

              </tr>

            </thead>

            <tbody>

              {selectedOrder.items.map((item) => (

                <tr key={item.id}>

                  <td>{item.name}</td>

                  <td>{item.quantity}</td>

                  <td>₹{item.unit_price}</td>

                  <td>₹{item.subtotal}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
};

export default AdminOrdersPage;