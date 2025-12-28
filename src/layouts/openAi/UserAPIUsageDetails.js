import React, { useEffect, useState } from 'react';
import { apiCall } from 'utils/apiClient';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Toaster } from 'react-hot-toast';
import Pagination from 'components/pagination';
import { DatePicker, Modal } from 'antd';
import ReactMarkdown from 'react-markdown';

const UserAPIUsageDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userId = location.state?.id || "";

    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const fetchData = async () => {
        try {
            const result = await apiCall({ endpoint: `ai-api-history/by-user/${userId}`, method: 'GET' });
            if (result.data) {
                setData(result.data);
                setTotalRecords(result?.pagination?.totalRecords);
                setCurrentPage(result?.pagination?.currentPage);
            }
        } catch (error) {
            console.error("Error fetching user API usage details:", error);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchData();
        }
    }, [startDate, endDate, currentPage, recordsPerPage, userId]);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" reverseOrder={false} />

            <div className="border-solid border-2 black-indigo-600 mt-6">
                <div className="px-8 mt-5 text-lg font-semibold">User API Usage Details</div>

                <div className="flex items-center justify-between">
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
                                <th className="px-6 py-4 text-center">API Endpoint</th>
                                <th className="px-6 py-4 text-center">Status Code</th>
                                <th className="px-6 py-4 text-center">Timestamp</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr className="border-b dark:border-neutral-500" key={item.id}>
                                    <td className="text-center px-6 py-4">{index + 1}</td>
                                    <td className="text-center px-6 py-4">{item.api_endpoint}</td>
                                    <td className="text-center px-6 py-4">{item.status_code}</td>
                                    <td className="text-center px-6 py-4">{item.created_at}</td>
                                    <td className="text-center px-6 py-4">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                            onClick={() => setSelectedRecord(item)}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Request & Response Details */}
            <Modal
                title="API Request & Response Details"
                open={!!selectedRecord}
                onCancel={() => setSelectedRecord(null)}
                footer={null}
            >
                {selectedRecord && (
                    <div className="max-h-[100%] overflow-y-auto p-4">
                        <p><strong>API Endpoint:</strong> {selectedRecord.api_endpoint}</p>
                        <p><strong>Status Code:</strong> {selectedRecord.status_code}</p>
                        <p><strong>Timestamp:</strong> {selectedRecord.created_at}</p>
                        <p><strong>Request Data:</strong></p>
                        <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(JSON.parse(selectedRecord.request_data), null, 2)}</pre>

                        <p><strong>Response Data:</strong></p>
                        <div className="bg-gray-100 p-4 rounded max-h-[300px] overflow-y-auto">
                            <ReactMarkdown>{selectedRecord.response_data}</ReactMarkdown>
                        </div>
                    </div>
                )}
            </Modal>

        </DashboardLayout>
    );
};

export default UserAPIUsageDetails;
