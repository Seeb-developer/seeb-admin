import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Toaster } from 'react-hot-toast';
import Pagination from 'components/pagination';
import { DatePicker } from 'antd';

const AIAPIHistory = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500); // Wait 500ms after the user stops typing

        return () => {
            clearTimeout(handler); // Clear the timeout if the user continues typing
        };
    }, [searchQuery]);

    const fetchData = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "ai-api-history/all", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    search: searchQuery,
                    startDate: startDate,
                    endDate: endDate,
                    page: currentPage,
                    perPage: recordsPerPage
                }),
            });

            const result = await response.json();
            if (result.data) {
                setData(result.data);
                setTotalRecords(result?.pagination?.totalRecords);
                setCurrentPage(result?.pagination?.currentPage);
            }
        } catch (error) {
            console.error("Error fetching AI API history:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [debouncedSearch, startDate, endDate, currentPage, recordsPerPage]);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" reverseOrder={false} />

            <div className="border-solid border-2 black-indigo-600 mt-6">
                <div className="px-8 mt-5 text-lg font-semibold">AI API History</div>

                {/* Search Input */}
                <div className="flex items-center justify-between">
                    <div className="w-1/3 m-4">
                        <input
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="px-8 w-1/3 py-4">
                        <DatePicker.RangePicker
                            onChange={(dates, dateStrings) => {
                                setStartDate(dateStrings[0]);
                                setEndDate(dateStrings[1]);
                            }}
                            format="YYYY-MM-DD"
                            className="w-full"
                        />
                    </div>
                    <div className="ml-auto">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(totalRecords / recordsPerPage)}
                            onPageChange={(page) => setCurrentPage(page)}
                            recordsPerPage={recordsPerPage}
                            onRecordsPerPageChange={(limit) => setRecordsPerPage(limit)}
                            totalRecords={totalRecords}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm font-light">
                        <thead className="border-b font-medium dark:border-neutral-500">
                            <tr>
                                <th className="px-6 py-4 text-center">Sr.No</th>
                                <th className="px-6 py-4 text-center">Name</th>
                                <th className="px-6 py-4 text-center">Count</th>
                                <th className="px-6 py-4 text-center">Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr className="border-b dark:border-neutral-500" key={item.id}>
                                    <td className="text-center px-6 py-4">{index + 1}</td>
                                    <td className="text-center px-6 py-4">
                                        <a onClick={() => navigate(`/open-ai/by-user`, { state: { id: item.user_id } })} className="text-blue-500 hover:underline cursor-pointer">
                                            {item.name}
                                        </a>
                                    </td>
                                    <td className="text-center px-6 py-4">{item.usage_count}</td>
                                    <td className="text-center px-6 py-4">{item.created_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AIAPIHistory;
