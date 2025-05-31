import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, DatePicker } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Toaster } from "react-hot-toast";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Pagination from "components/pagination";
import { FaSortDown, FaSortUp } from "react-icons/fa";

const antIcon = <LoadingOutlined style={{ fontSize: 60 }} spin />;

const CartPage = () => {
    const [cartData, setCartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [dateRange, setDateRange] = useState([]);
    const [quickFilter, setQuickFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [sortField, setSortField] = useState('craeted_at'); // or 'amount'
    const [sortOrder, setSortOrder] = useState('desc'); // or 'desc'

    const navigate = useNavigate();

    // Debounce search
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    // Fetch data with filters
    const fetchCartData = async () => {
        setCartData([]);
        setTotalRecords(0);
        setTotalPages(0);
        setLoading(true);
        try {
            const body = {
                page: currentPage,
                limit: recordsPerPage,
                search: debouncedSearchTerm || undefined,
                startDate: dateRange[0]?.format("YYYY-MM-DD"),
                endDate: dateRange[1]?.format("YYYY-MM-DD"),
                filter: quickFilter || undefined,
                sort_by: sortField || undefined,
                sort_dir: sortOrder || undefined,
            };

            const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}seeb-cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const result = await response.json();

            if (result.status === 200) {
                setCartData(result.data || []);
                setTotalRecords(result.pagination?.total_records || 0);
                setTotalPages(result.pagination?.total_pages || 0);
            }
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCartData();
    }, [debouncedSearchTerm, dateRange, quickFilter, currentPage, recordsPerPage, sortField, sortOrder]);

    const clearFilters = () => {
        setSearchTerm("");
        setDebouncedSearchTerm("");
        setDateRange([]);
        setQuickFilter("");
        setCurrentPage(1);
    };

    const handleSort = (field) => {
        if (sortField === field) {
            // Toggle between asc <=> desc
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" reverseOrder={false} />

            {loading ? (
                <div className="flex justify-center items-center h-[75vh] w-full">
                    <Spin indicator={antIcon} />
                </div>
            ) : (
                <div className="border-solid border-2 black-indigo-600 mt-6">
                    <div className="px-8 mt-5 text-lg font-semibold">Cart Summary</div>

                    {/* Filters */}
                    <div className="flex flex-col gap-4 px-8 py-4 bg-white rounded-lg shadow mt-4 mx-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            {/* Search */}
                            <div className="w-full sm:w-60">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Search Cart by Name"
                                />
                            </div>

                            {/* Date Range Picker */}
                            <div className="w-full sm:w-72">
                                <DatePicker.RangePicker
                                    value={dateRange}
                                    onChange={(dates) => setDateRange(dates || [])}
                                    format="YYYY-MM-DD"
                                    className="w-full"
                                />
                            </div>

                            {/* Quick Filters */}
                            <div className="flex flex-wrap gap-2">
                                {["today", "this_week", "this_month"].map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setQuickFilter(filter)}
                                        className={`text-sm px-3 py-1 rounded transition-all duration-150 ${quickFilter === filter
                                            ? "bg-blue-700 text-white"
                                            : "bg-blue-300 text-white hover:bg-blue-600"
                                            }`}
                                    >
                                        {filter === "today" && "Today"}
                                        {filter === "this_week" && "This Week"}
                                        {filter === "this_month" && "This Month"}
                                    </button>
                                ))}
                            </div>

                            {/* Clear Filters Button */}
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                            >
                                <span>&#x2715;</span>
                                Clear Filters
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto relative mt-6 mx-6">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="py-3 px-6">Sr No</th>
                                    <th className="py-3 px-6">User Name</th>
                                    <th className="py-3 px-6">User Phone</th>
                                    <th className="py-3 px-6">Email</th>
                                    <th className="py-3 px-6">Total Items</th>
                                    <th className="py-3 px-6 cursor-pointer" onClick={() => handleSort("amount")}>
                                        Total Amount
                                        {sortField === "amount" && (
                                            sortOrder === "asc" ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />
                                        )}
                                    </th>

                                    <th className="py-3 px-6 cursor-pointer" onClick={() => handleSort("craeted_at")}>
                                        Date
                                        {sortField === "craeted_at" && (
                                            sortOrder === "asc" ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />
                                        )}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartData.length > 0 ? (
                                    cartData.map((user, index) => (
                                        <tr className="bg-white border-b hover:bg-gray-50" key={user.user_id}>
                                            <td className="py-4 px-6">{index + 1}</td>
                                            <td
                                                className="py-4 px-6 cursor-pointer text-blue-500 underline"
                                                onClick={() => navigate("/cart-details", { state: { user } })}
                                            >
                                                {user.user_name}
                                            </td>
                                            <td className="py-4 px-6">{user.user_phone}</td>
                                            <td className="py-4 px-6">{user.user_email}</td>
                                            <td className="py-4 px-6">{user.total_items}</td>
                                            <td className="py-4 px-6 font-semibold">₹{user.total_amount}</td>
                                            <td className="py-4 px-6 font-semibold">{user.latest_cart_date}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-4 text-center">
                                            No Cart Data Available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(number) => setCurrentPage(number)}
                            recordsPerPage={recordsPerPage}
                            onRecordsPerPageChange={(value) => {
                                setCurrentPage(1);
                                setRecordsPerPage(value);
                            }}
                            totalRecords={totalRecords}
                            count={cartData.length}
                        />
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default CartPage;
