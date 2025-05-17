import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { MdModeEdit } from 'react-icons/md';
import { LoadingOutlined } from '@ant-design/icons';
import { DatePicker, Spin } from 'antd';
import { Toaster, toast } from 'react-hot-toast';
import Toggle from 'react-toggle';
import Pagination from 'components/pagination';

const ListBookings = () => {
    const antIcon = <LoadingOutlined style={{ fontSize: 60 }} spin />;
    const deletstyle = { color: "red" };
    const editstyle = { color: "green" };

    const [bookingData, setBookingData] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [Loader, setLoader] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [totalPages, setTotalPage] = useState(0)
    const [totalRecords, setTotalRecords] = useState(0)
    const [dateRange, setDateRange] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [quickFilter, setQuickFilter] = useState('');

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    }
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300); // 300ms delay

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);


    const navigate = useNavigate();

    // Fetch all Bookings
    const getAllBookings = async () => {
        try {
            setLoader(true);

            const body = {
                page: currentPage,
                limit: recordsPerPage,
                status: selectedStatus || undefined,
                search: debouncedSearchTerm || undefined,
                startDate: dateRange[0]?.format("YYYY-MM-DD"),
                endDate: dateRange[1]?.format("YYYY-MM-DD"),
                filter: quickFilter || undefined
            };

            const requestOptions = {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            };

            const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}booking`, requestOptions);
            const result = await response.json();

            if (result.status === 200) {
                setBookingData(result.data || []);
                setFilteredBookings(result.data || []);
                setTotalRecords(result.pagination.total_records || 0);
                setTotalPage(result.pagination.total_pages || 0);
                setCurrentPage(page);
            } else {
                console.error('Failed to fetch bookings:', result.message);
            }
        } catch (error) {
            console.error('Error fetching Bookings:', error);
        } finally {
            setLoader(false);
        }
    };



    // Handle search change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value === '') {
            setFilteredBookings(bookingData);
        } else {
            const filtered = bookingData.filter(booking =>
                booking.user_name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredBookings(filtered);
        }
    };

    // Toggle Booking Status
    const handleToggleStatus = async (id, status) => {

        try {
            const response = await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + `booking/change-status/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: status }),
            });
            const result = await response.json();
            if (result.status === 200) {
                // getAllBookings();
                setFilteredBookings(prevData => prevData.map(el =>
                    el.id === id ? { ...el, status: status } : el
                ));
            } else {
                console.error("Error updating status:", result.message);
            }
        } catch (error) {
            console.error("Request failed:", error);
        }
    };

    useEffect(() => {
        getAllBookings();
    }, [currentPage, recordsPerPage, selectedStatus, debouncedSearchTerm, dateRange, quickFilter]);



    const handlePageChange = (number) => {
        setCurrentPage(number);
    };

    // Handle records per page changes
    const handleRecordsPerPageChange = (value) => {
        setCurrentPage(1); // Reset to first page when records per page change
        setRecordsPerPage(value);
    };

    const handleDateRangeChange = (dates) => {
        setDateRange(dates || []);
    };




    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" reverseOrder={false} />
            {Loader ? (
                <div className='flex justify-center items-center h-[75vh] w-full'>
                    <Spin indicator={antIcon} />
                </div>
            ) : (
                <div className="border-solid border-2 black-indigo-600 mt-6">
                    <div className="px-8 mt-5 text-lg font-semibold">Bookings</div>
                    <div className="flex flex-col gap-4 px-4 py-4 bg-white rounded-lg shadow mx-6 mt-4">
                        {/* Row 1: Search, Date Range, Status, Pagination */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            {/* Search Input */}
                            <div className="w-full sm:w-60">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Search expenses..."
                                />

                            </div>

                            {/* Date Range Picker */}
                            <div className="w-full sm:w-72">
                                <DatePicker.RangePicker
                                    onChange={handleDateRangeChange}
                                    format="YYYY-MM-DD"
                                    className="w-full"
                                    value={dateRange}
                                />
                            </div>

                            {/* Status Dropdown */}
                            <div className="w-full sm:w-40">
                                <select
                                    value={selectedStatus}
                                    onChange={handleStatusChange}
                                    className="w-full text-sm bg-white border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="completed">Completed</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="failed_payment">Failed Payment</option>
                                </select>
                            </div>

                            {/* Pagination */}
                            <div className="w-full lg:w-auto">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    recordsPerPage={recordsPerPage}
                                    onRecordsPerPageChange={handleRecordsPerPageChange}
                                    totalRecords={totalRecords}
                                    count={filteredBookings.length}
                                />
                            </div>
                        </div>

                        {/* Row 2: Quick Filters */}
                        <div className="flex flex-wrap gap-2 items-center">
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

                            {/* Clear Filters Button */}
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setDebouncedSearchTerm("");
                                    setDateRange([]);
                                    setSelectedStatus("");
                                    setQuickFilter("");
                                }}
                                className="text-sm px-3 py-1 rounded bg-blue-400 hover:bg-blue-800 text-white ml-auto"
                            >
                                &#x2715; {/* Unicode for ✕ (multiply symbol) */}
                                Clear Filters
                            </button>
                        </div>

                    </div>

                    <div className="overflow-x-auto relative mt-6 mx-6">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="py-3 px-6">Sr No</th>
                                    <th className="py-3 px-6">Customer Name</th>
                                    <th className="py-3 px-6">Booking ID</th>
                                    <th className="py-3 px-6">Total Amount</th>
                                    <th className="py-3 px-6">Discount</th>
                                    <th className="py-3 px-6">Paid Amount</th>
                                    <th className="py-3 px-6">Payment Type</th>
                                    <th className="py-3 px-6">Payment Status</th>
                                    <th className="py-3 px-6">Booking Date</th>
                                    <th className="py-3 px-6">Status</th>
                                    <th className="py-3 px-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings?.length > 0 ? (
                                    filteredBookings.map((el, index) => (
                                        <tr className="bg-white border-b hover:bg-gray-50" key={el.id}>

                                            <td className="py-4 px-6">{index + 1}</td>
                                            <td
                                                className="py-4 px-6 cursor-pointer text-blue-500 underline"
                                                onClick={() => navigate('/booking-details', { state: { booking_id: el.id } })}
                                            >
                                                {el.user_name}
                                            </td>
                                            <td className="py-4 px-6">{el.booking_id}</td>
                                            <td className="py-4 px-6">{el.total_amount}</td>
                                            <td className="py-4 px-6">{el.discount}</td>
                                            <td className="py-4 px-6">{el.paid_amount}</td>
                                            <td className="py-4 px-6">{el.payment_type}</td>
                                            <td className="py-4 px-6">{el.payment_status}</td>
                                            <td className="py-4 px-6">{el.created_at}</td>
                                            <td className="py-4 px-6">{el.status}</td>

                                            <td className="py-4 px-6 flex items-center gap-3">
                                                {/* Show dropdown only if status is not Completed or Cancelled */}
                                                {el.status !== "completed" && el.status !== "cancelled" && (
                                                    <select
                                                        value={el.status}
                                                        onChange={(e) => handleToggleStatus(el.id, e.target.value)}
                                                        className="text-sm border border-gray-300 rounded px-2 py-1"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="in_progress">In Progress</option>
                                                        <option value="failed_payment">Failed Payment</option>
                                                    </select>
                                                )}

                                                {/* Show Edit icon only if not Completed */}
                                                {el.status !== "completed" && el.status !== "cancelled" && (
                                                    <MdModeEdit
                                                        size={24}
                                                        style={editstyle}
                                                        onClick={() => navigate(`/bookings/edit/${el.id}`)}
                                                        className="cursor-pointer"
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-4 text-center">No Bookings Available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
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
                            count={filteredBookings.length}
                        />
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default ListBookings;
