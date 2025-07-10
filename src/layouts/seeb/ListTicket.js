import React, { useEffect, useState } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, DatePicker } from "antd";
import { Toaster, toast } from "react-hot-toast";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Pagination from "components/pagination";
import { useNavigate } from "react-router-dom";

const ListTicket = () => {
    const antIcon = <LoadingOutlined style={{ fontSize: 60 }} spin />;

    const [tickets, setTickets] = useState([]);
    const [Loader, setLoader] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [dateRange, setDateRange] = useState([]);
    const [status, setStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        getAllTickets();
    }, [currentPage, recordsPerPage, searchQuery, dateRange, status]);

    const getAllTickets = async () => {
        // setLoader(true);
        try {
            const response = await fetch(
                process.env.REACT_APP_HAPS_MAIN_BASE_URL + "tickets/all",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        search: searchQuery,
                        start_date: dateRange.length > 0 ? dateRange[0] : null,
                        end_date: dateRange.length > 0 ? dateRange[1] : null,
                        status: status,
                        limit: recordsPerPage,
                        page: currentPage,
                    }),
                }
            );

            const result = await response.json();
            setLoader(false);
            if (result.status === 200) {
                setTickets(result.data);
                setTotalRecords(result.pagination.total);
                setTotalPages(result.pagination.last_page);
            }
        } catch (error) {
            setLoader(false);
            console.error("Error fetching tickets:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}tickets/${id}`, { method: 'DELETE' });
            const result = await response.json();
            if (result.status === 200) {
                getAllTickets();
                toast.success("Ticket Deleted Successfully");
            }
        } catch (error) {
            console.error('Error deleting ticket:', error);
            toast.error("Error while deleting ticket.");
        }
    };

    const handleDateRangeChange = (dates) => {
        if (dates && dates.length === 2) {
            setDateRange([dates[0].format("YYYY-MM-DD"), dates[1].format("YYYY-MM-DD")]);
        } else {
            setDateRange([]);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleRecordsPerPageChange = (newLimit) => {
        setRecordsPerPage(newLimit);
        setCurrentPage(1); // Reset to first page on limit change
    };
    const navigate = useNavigate()
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" reverseOrder={false} />

            {Loader ? (
                <div className='flex justify-center items-center h-[75vh] w-full'>
                    <Spin indicator={antIcon} />
                </div>
            ) : (
                <div className="border-solid border-2 black-indigo-600 mt-6 p-6 rounded-lg shadow-lg bg-white">
                    <div className="px-8 mt-5 text-lg font-semibold">Tickets</div>

                    {/* Filters */}
                    <div className="flex items-center justify-between">
                        {/* Search Bar */}
                        <div className="w-1/3 m-4">
                            <input
                                type="text"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="Search by User Name or Ticket ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Date Range Picker */}
                        <div className="px-8 w-1/3 py-4 ">
                            <DatePicker.RangePicker
                                onChange={handleDateRangeChange}
                                format="YYYY-MM-DD"
                                className="w-full"
                            />
                        </div>

                        {/* Status Dropdown */}
                        <div className="relative w-1/4">
                            <label className="block text-sm font-medium text-gray-900">Status</label>
                            <select
                                className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">Select Status</option>
                                <option value='open'>Open</option>
                                <option value='in_progress'>In Progress</option>
                                <option value='closed'>Closed</option>
                            </select>
                        </div>

                        {/* Pagination Controls */}
                        <div className="ml-auto">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                recordsPerPage={recordsPerPage}
                                onRecordsPerPageChange={handleRecordsPerPageChange}
                                totalRecords={totalRecords}
                            />
                        </div>
                    </div>
                    {Loader ? (
                        <div className="flex justify-center items-center h-[75vh] w-full">
                            <Spin indicator={antIcon} />
                        </div>
                    ) : (
                        <div className="border-solid border-2 black-indigo-600 mt-6 p-6 rounded-lg shadow-lg bg-white">
                            <div className="overflow-x-auto relative mt-6">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-4 w-1/6">Sr. No</th>
                                            <th className="py-3 px-4 w-1/6">Ticket ID</th>
                                            <th className="py-3 px-4 w-1/6">User Name</th>
                                            <th className="py-3 px-6 w-1/4">Subject</th>
                                            <th className="py-3 px-6 w-1/6">Status</th>
                                            <th className="py-3 px-6 w-1/8">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tickets.length > 0 ? (
                                            tickets.map((ticket, index) => (
                                                <tr className="bg-white border-b hover:bg-gray-50" key={ticket.id}>
                                                    <td className="py-4 px-4">{index + 1}</td>
                                                    <td className="py-4 px-4 text-blue-600 hover:underline cursor-pointer"
                                                        onClick={() => navigate("/ticket/ticket-details", { state: { ticket} })}>
                                                        {ticket.ticket_uid}
                                                    </td>
                                                    <td className="py-4 px-4">{ticket.user_name}</td>
                                                    <td className="py-4 px-6">{ticket.subject}</td>
                                                    <td className="py-4 px-6">{ticket.status}</td>
                                                    <td className="py-4 px-6 flex items-center">
                                                        {ticket.created_at}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="py-4 text-center">
                                                    No Tickets Available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </DashboardLayout>
    );
};

export default ListTicket
