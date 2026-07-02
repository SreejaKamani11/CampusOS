import { useEffect, useState } from "react";
import { FaUsers, FaShoppingCart, FaRupeeSign, FaPrint } from "react-icons/fa";

import StatCard from "../../components/admin/StatCard";
import { getDashboardStats } from "../../services/admin.service";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalPrintJobs: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-lg font-medium">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<FaUsers />}
          color="blue"
        />

        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<FaShoppingCart />}
          color="green"
        />

        <StatCard
          title="Revenue"
          value={`₹${stats.totalRevenue}`}
          icon={<FaRupeeSign />}
          color="yellow"
        />

        <StatCard
          title="Print Jobs"
          value={stats.totalPrintJobs}
          icon={<FaPrint />}
          color="purple"
        />

      </div>
    </div>
  );
};

export default AdminDashboardPage;