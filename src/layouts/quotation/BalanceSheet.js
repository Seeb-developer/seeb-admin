import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { MdModeEdit } from 'react-icons/md';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Toaster, toast } from 'react-hot-toast';
import { DatePicker } from 'antd';
import { Pie } from 'react-chartjs-2'; // Importing Pie chart
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import Pagination from 'components/pagination';

// Registering chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const BalanceSheet = () => {

    const location = useLocation();
    const type = location.state?.type || "Interior";

    const antIcon = <LoadingOutlined style={{ fontSize: 60 }} spin />;
    const navigate = useNavigate();

    const [expenseData, setExpenseData] = useState([]);
    const [Loader, setLoader] = useState(false);
    const [formData, setFormData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0)
    const [filteredData, setFilteredData] = useState(expenseData);
    const [dateRange, setDateRange] = useState([null, null]);


    const getAllExpenses = async (page = 1, perPage = 10, startDate = null, endDate = null) => {
        // setLoader(true); // Start loader

        const requestBody = {
            page: page,
            perPage: perPage,
            type: type
        };

        // Add date range parameters if available
        if (startDate && endDate) {
            requestBody.start_date = startDate;
            requestBody.end_date = endDate;
        }

        try {
            const response = await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + `transactions/getAll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Specify the content type as JSON
                },
                body: JSON.stringify(requestBody), // Send data in the body as JSON
            });

            const result = await response.json();

            // Update states with the fetched data
            setExpenseData(result.data);
            setFilteredData(result.data); // Assuming filtered data is also the result data
            // calculateSummary(result.data);
            setTotalExpense(result?.totals?.expense)
            setTotalIncome(result?.totals?.income)
            setTotalPage(result?.pagination?.totalPages)
            setTotalRecords(result?.pagination?.totalRecords)
            setLoader(false); // Stop loader
        } catch (error) {
            console.log('Error fetching expenses:', error);
            setLoader(false); // Stop loader on error
        }
    };


    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
        if (dates[0] && dates[1]) {
            const startDate = dates[0].toISOString().split('T')[0]; // Format to YYYY-MM-DD
            const endDate = dates[1].toISOString().split('T')[0];   // Format to YYYY-MM-DD

            // Call API with updated date range and pagination
            getAllExpenses(currentPage, recordsPerPage, startDate, endDate);
        }
    };

    useEffect(() => {
        setLoader(true);
        getAllExpenses();
    }, [type]);

    const chartData = {
        labels: ['Income', 'Expense'], // Pie chart categories
        datasets: [
            {
                data: [
                    filteredData?.filter(item => item.transaction_type === 'Income')?.reduce((sum, item) => sum + parseFloat(item.amount), 0),
                    filteredData?.filter(item => item.transaction_type === 'Expense')?.reduce((sum, item) => sum + parseFloat(item.amount), 0)
                ], // Sum of income and expense
                backgroundColor: ['#36A2EB', '#FF6384'], // Colors for the slices
                hoverBackgroundColor: ['#36A2EB', '#FF6384'],
            }
        ]
    };


    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [totalPages, setTotalPage] = useState(0)

    const handlePageChange = (number) => {
        getAllExpenses(number, recordsPerPage, dateRange[0], dateRange[1]);
        setCurrentPage(number);

        // Call API with updated page number and date range
    };


    // Handle records per page changes
    const handleRecordsPerPageChange = (value) => {
        getAllExpenses(1, value, dateRange[0], dateRange[1]);
        setRecordsPerPage(value);
        setCurrentPage(1); // Reset to first page when records per page change

        // Call API with updated records per page and date range
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
                    {/* Range Calendar */}

                    {/* Summary Section */}
                    <div className="px-8 py-4 bg-gray-100 rounded-md">
                        <h2 className="text-lg font-semibold mb-2">Summary</h2>
                        <div className='flex items-center justify-between'>
                            <div>
                                <div className="text-green-600">
                                    <strong>Total Income:</strong> ₹{totalIncome}
                                </div>
                                <div className="text-red-600">
                                    <strong>Total Expense:</strong> ₹{totalExpense}
                                </div>
                                <div className="mt-4 flex justify-between">
                                    <div className={`${totalIncome - totalExpense >= 0 ? "text-green-600" : "text-red-600"}`}>
                                        <strong>{totalIncome - totalExpense >= 0 ? "Profit:" : "Loss:"}</strong> ₹{(totalIncome - totalExpense).toFixed(2)}
                                    </div>
                                </div>

                            </div>
                            {/* Pie Chart */}
                            <div style={{ width: 200, height: 150 }} className="px-8 py-4 mt-6">
                                <Pie data={chartData} options={{ responsive: true, }} />
                            </div>

                        </div>
                        {/* <div className="">
                            <h3 className="font-medium">Category-wise Expenses:</h3>
                            <ul className="list-disc pl-5">
                                {Object.entries(categoryWiseExpenses)?.map(([category, amount]) => (
                                    <li key={category}>
                                        {category}: ₹{amount}
                                    </li>
                                ))}
                            </ul>
                        </div> */}
                    </div>


                    {/* Expenses Table */}
                    <hr />
                    <div style={{ fontSize: 15 }} className="px-8 mt-5">Balance Sheet</div>
                    <div className="flex items-center justify-between">
                        <div className="w-1/3 m-4">
                            <input
                                type="text"
                                id="simple-search"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="Search expenses..."
                                required
                            />
                        </div>
                        <div className="px-8 w-1/3 py-4 ">
                            <DatePicker.RangePicker
                                onChange={handleDateRangeChange}
                                format="YYYY-MM-DD"
                                className="w-full"
                            />
                        </div>
                        <div className="ml-auto">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                recordsPerPage={recordsPerPage}
                                onRecordsPerPageChange={handleRecordsPerPageChange}
                                totalRecords={totalRecords}
                                count={filteredData?.length}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                <div className="overflow-hidden">
                                    <table className="min-w-full text-left text-sm font-light">
                                        <thead className="border-b font-medium">
                                            <tr>
                                                <th scope="col" className="px-6 py-4">Sr.No</th>
                                                <th scope="col" className="px-6 py-4">Customer Name</th>
                                                <th scope="col" className="px-6 py-4">Description</th>
                                                <th scope="col" className="px-6 py-4">Income</th>
                                                <th scope="col" className="px-6 py-4">Expense</th>
                                                <th scope="col" className="px-6 py-4">Payment Method</th>
                                                <th scope="col" className="px-6 py-4">Transaction No</th>
                                                <th scope="col" className="px-6 py-4">Date</th>
                                                <th scope="col" className="px-6 py-4">Category</th>
                                                <th scope="col" className="px-6 py-4">Vendor/Client</th>
                                                <th scope="col" className="px-6 py-4">Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData && filteredData.map((el, i) => (
                                                <tr className="border-b" key={i}>
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium">{i + 1}</td>
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium">{el.customer_name}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{el.description}</td>
                                                    <td className="whitespace-nowrap px-6 py-4 font-semibold text-green-600">{el.transaction_type === 'Income' ? el.amount : '-'}</td>
                                                    <td className="whitespace-nowrap px-6 py-4 font-semibold text-red-600">{el.transaction_type === 'Expense' ? el.amount : '-'}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{el.payment_method}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{el.transaction_no}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{el.date}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{el.category}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{el.vendor_or_client}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{el.remarks}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default BalanceSheet;
