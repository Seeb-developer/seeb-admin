import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { apiCall } from "utils/apiClient";

const antIcon = <LoadingOutlined style={{ fontSize: 60 }} spin />;

const UserCartDetails = () => {
    const location = useLocation();
    const user = location.state?.user;
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUserCartItems = useCallback(async () => {
        setLoading(true);
        try {
            const result = await apiCall({
                endpoint: `seeb-cart/getCart/${user.user_id}`,
                method: "GET",
            });
            if (result && result.status === 200) {
                setCartItems(result.data || []);
            }
        } catch (error) {
            console.error("Error fetching user cart details:", error);
        } finally {
            setLoading(false);
        }
    }, [user.user_id]);

    useEffect(() => {
        fetchUserCartItems();
    }, [fetchUserCartItems]);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <div className="p-6">
                {/* Page Title */}
                <h2 className="text-lg font-semibold px-8">Cart Details for {user?.user_name}</h2>
                <div className="px-8 mt-2 text-gray-600">
                    <p><strong>Email:</strong> {user?.user_email}</p>
                    <p><strong>Total Items:</strong> {user?.total_items}</p>
                    <p><strong>Total Amount:</strong> ₹{user?.total_amount}</p>
                </div>

                {/* Loader */}
                {loading ? (
                    <div className="flex justify-center items-center h-[75vh] w-full">
                        <Spin indicator={antIcon} />
                    </div>
                ) : (
                    <div className="border-solid border-2 black-indigo-600 mt-6 px-8 pb-6">
                        {/* Table Section */}
                        <div className="overflow-x-auto relative mt-4">
                            {cartItems.length > 0 ? (
                                <table className="w-full text-sm text-left text-gray-500 border border-gray-300">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-6 border border-gray-300">Image</th>
                                            <th className="py-3 px-6 border border-gray-300">Service</th>
                                            <th className="py-3 px-6 border border-gray-300">Size</th>
                                            <th className="py-3 px-6 border border-gray-300">Rate Type</th>
                                            <th className="py-3 px-6 border border-gray-300">Rate</th>
                                            <th className="py-3 px-6 border border-gray-300">Total</th>
                                            <th className="py-3 px-6 border border-gray-300">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item) => (
                                            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="py-4 px-6 border border-gray-300">
                                                    <img
                                                        src={`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${item.service_image}`}
                                                        alt={item.service_name}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                </td>
                                                <td className="py-4 px-6 border border-gray-300">{item.service_name}</td>
                                                <td className="py-4 px-6 border border-gray-300">{item.value || "N/A"}</td>
                                                <td className="py-4 px-6 border border-gray-300">{item.rate_type}</td>
                                                <td className="py-4 px-6 border border-gray-300 font-medium">₹{item.rate}</td>
                                                <td className="py-4 px-6 border border-gray-300 font-semibold">₹{item.amount}</td>
                                                <td className="py-4 px-6 border border-gray-300">{item.description || "No description"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center text-gray-500 py-6">No cart items found for this user.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default UserCartDetails;
