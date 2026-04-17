import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// 1. Import the service instead of the raw client
import { fetchMyOrders } from "../api/ApiService"; 
import { Loader2, Package } from "lucide-react";
import Breadcrumb from "../components/ui/Breadcrumb";

import OrderFilterBar from "../components/my-order/OrderFilterBar";
import OrderCard from "../components/my-order/OrderCard";
import OrderPagination from "../components/my-order/OrderPagination";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  
  const navigate = useNavigate();

  const getOrders = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      // 2. Use the centralized service function
      const response = await fetchMyOrders(selectedMonth, selectedYear, page);
      
      // Based on your safeRequest helper, response is res.data
      // Ensure we extract the nested data correctly
      const orderData = response.data || {}; 

      setOrders(orderData.orders || []);
      setPagination({ 
        currentPage: orderData.currentPage || 1, 
        totalPages: orderData.totalPages || 1 
      });
    } catch (err) {
      console.error("Order Page Error:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    getOrders(1);
  }, [getOrders]);

  // Client-side filtering for the search bar
  const filteredOrders = orders.filter((order) => 
    order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some((item) => item.productName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="py-8 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <Breadcrumb productName="My Orders" />
        <div className="mt-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
          <p className="text-sm text-gray-500 font-medium">Manage and track your dental supplies</p>
        </div>

        <OrderFilterBar 
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear} setSelectedYear={setSelectedYear}
        />

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#E68736] mb-4" size={48} />
            <p className="text-gray-500 font-medium">Fetching your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <Package size={40} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800">No Orders Found</h3>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <OrderCard 
                key={order._id} 
                order={order} 
                onClick={() => navigate(`/order/${order.orderId}`)} 
              />
            ))}

            <OrderPagination 
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(newPage) => getOrders(newPage)} // 🔥 Change fetchMyOrders to getOrders
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;