import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { MdModeEdit } from 'react-icons/md';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Toaster, toast } from 'react-hot-toast';
import ExpenseForm from './component/ExpenseForm';
import * as XLSX from 'xlsx'; // Import for Excel download
import { jsPDF } from 'jspdf'; // Import for PDF download
import Papa from 'papaparse'; // Import for CSV download
import PropTypes from 'prop-types';
import Pagination from 'components/pagination';
import EditExpenseForm from './component/EditExpenseForm';

const ListExpense = ({ id, type }) => {
    const location = useLocation();
    // const id = location.state?.id;
    // const type = location.state?.type
    const antIcon = <LoadingOutlined style={{ fontSize: 60 }} spin />;
    const navigate = useNavigate();

    const [expenseData, setExpenseData] = useState([]);
    const [Loader, setLoader] = useState(false);
    const [formData, setFormData] = useState([{
        transaction_type: "Expense",
        category: "",
        amount: "",
        payment_method: "",
        transaction_no: "",
        vendor_or_client: "",
        remarks: "",
        description: "",
    }]);


    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [editRow, setEditRow] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [totalPages, setTotalPage] = useState(0)
    const [totalRecords, setTotalRecords] = useState(0)
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [row, setRows] = useState({})
    const [editMode, setEditMode] = useState(false)

    // Restore formData from localStorage on page load
    useEffect(() => {
        const storedData = localStorage.getItem("formDataBackup");
        if (storedData) {
            setFormData(JSON.parse(storedData));
        }
    }, []);

    // Update localStorage whenever formData changes
    useEffect(() => {
        localStorage.setItem("formDataBackup", JSON.stringify(formData));
    }, [formData]);

    const handleOnSubmit = async () => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const updatedFormData = formData.map(item => ({
            ...item,
            type,
            quotation_id: id,
            date: new Date().toISOString().split('T')[0]
        }));
        const raw = JSON.stringify(updatedFormData);


        const requestOptions = {
            method: "POST",  // Use PUT for editing, POST for adding new
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "transactions/create", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 201 || result.status === 207) {
                    toast.success(result.message);
                    getAllExpenses();
                    setFormData([{
                        transaction_type: "Expense",
                        category: "",
                        amount: "",
                        payment_method: "",
                        transaction_no: "",
                        vendor_or_client: "",
                        remarks: "",
                        description: "",
                    }]);
                    // Clear localStorage after successful submission
                    localStorage.removeItem("formDataBackup");
                } else {
                    toast.error(result.Message || "Failed to save expense");
                }
            })
            .catch((error) => console.error("Error:", error));
    };



    const getAllExpenses = async (page = 1, perPage = 10, searchQuery = '') => {
        setLoader(true); // Show loader before fetching data

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                page: page,     // Ensure you have currentPage state
                perPage: perPage, // Ensure you have recordsPerPage state
                search: searchQuery,   // Ensure you have searchQuery state
            }),
        };

        try {
            const response = await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + 'transactions', requestOptions);
            const result = await response.json();

            setLoader(false);
            if (result.data) {
                setExpenseData(result.data);
                setTotalExpense(result?.totals?.expense)
                setTotalIncome(result?.totals?.income)
                setTotalPage(result?.pagination?.totalPages)
                setTotalRecords(result?.pagination?.totalRecords)
                // calculateSummary(result.data);
            }
        } catch (error) {
            console.log('Error fetching expenses:', error);
            setLoader(false);
        }
    };



    const saveRow = async (row) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: "PUT", // Assuming PUT for updates
            headers: myHeaders,
            body: JSON.stringify(row),
            redirect: "follow",
        };

        await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + `transactions/${row.id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status === 200) {
                    toast.success("Expense Updated Successfully");
                    setEditMode(false)
                    getAllExpenses()
                } else {
                    toast.error(result.Message || "Failed to update expense");
                }
                setEditRow(null); // Exit edit mode after saving
                getAllExpenses();
            })
            .catch(error => console.error("Error updating expense:", error))
            .finally(() => setLoader(false))
    };

    useEffect(() => {
        setLoader(true);
        getAllExpenses();
    }, []);

    // Function to download as Excel
    const downloadExcel = () => {
        const ws = XLSX.utils.json_to_sheet(expenseData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Expenses");
        XLSX.writeFile(wb, "expenses.xlsx");
    };

    const handlePageChange = (number) => {
        getAllExpenses(number, recordsPerPage);
        setCurrentPage(number);
    };

    // Handle records per page changes
    const handleRecordsPerPageChange = (value) => {
        getAllExpenses(1, value);
        setRecordsPerPage(value);
        setCurrentPage(1); // Reset to first page when records per page change
    };

    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };
    const handleSearchChange = useCallback(
        debounce((value) => setDebouncedSearch(value), 500),
        []
    );

    useEffect(() => {
        getAllExpenses(1, recordsPerPage, debouncedSearch); // Reset to page 1 on search
    }, [debouncedSearch]);



    return (
    
        <div >
            {/* Summary Section */}
            
            {/* Summary Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 mt-6">
                <div className="bg-blue-100 p-4 rounded-md shadow-sm">
                    <h3 className="text-sm font-semibold mb-1">Total Income</h3>
                    <p className="text-lg font-bold text-green-700">₹{totalIncome || 0}</p>
                </div>
                <div className="bg-red-100 p-4 rounded-md shadow-sm">
                    <h3 className="text-sm font-semibold mb-1">Total Expense</h3>
                    <p className="text-lg font-bold text-red-700">₹{totalExpense || 0}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-md shadow-sm">
                    <h3 className="text-sm font-semibold mb-1">Total GST</h3>
                    <p className="text-lg font-bold text-yellow-700">₹{0}</p>
                </div>
                <div className={`p-4 rounded-md shadow-sm ${(totalIncome - totalExpense).toFixed(2) >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <h3 className="text-sm font-semibold mb-1">Profit / Loss</h3>
                    <p className={`text-lg font-bold ${(totalIncome - totalExpense).toFixed(2) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        ₹{(totalIncome - totalExpense).toFixed(2) || 0}
                    </p>
                </div>
            </div>

            {/* Expenses Table */}
            {editMode ?
                <EditExpenseForm handleOnSubmit={() => saveRow(row)} formData={row} setFormData={setRows} handleCancel={(e) => {
                    e.preventDefault()
                    setEditMode(false)
                }} />
                :
                <ExpenseForm handleOnSubmit={handleOnSubmit} formData={formData} setFormData={setFormData} />
            }

            <div>
                <h3 className="text-md font-semibold mb-2">List Transactions</h3>
            </div>
            <div className="flex items-center justify-between w-full">
                <div className="relative w-1/2">
                    <input
                        type="text"
                        id="simple-search"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Search transactions..."
                        required
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            handleSearchChange(e.target.value);
                        }}
                    />
                </div>

                {/* Download Buttons */}
                <div className="flex space-x-2">
                    <button onClick={downloadExcel} className="bg-blue-500 text-sm text-white  py-3 px-4 ml-3 rounded-md">Download Excel</button>
                    {/* <button onClick={downloadPDF} className="bg-blue-500 text-white py-2 px-4 rounded-md">Download PDF</button> */}
                    {/* <button onClick={downloadCSV} className="bg-blue-500 text-white py-2 px-4 rounded-md">Download CSV</button> */}
                </div>

                {/* Pagination */}
                <div className="ml-auto">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        recordsPerPage={recordsPerPage}
                        onRecordsPerPageChange={handleRecordsPerPageChange}
                        totalRecords={totalRecords}
                        count={expenseData?.length}
                    />
                </div>
            </div>

            <div className="border-solid border-2 black-indigo-600 mt-6">
                <div className="flex flex-col">
                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                            <div className="overflow-hidden">
                                <table className="min-w-full text-left text-sm font-light">
                                    <thead className="border-b font-medium">
                                        <tr>
                                            <th scope="col" className="px-6 py-4">Sr.No</th>
                                            <th scope="col" className="px-6 py-4">Description</th>
                                            <th scope="col" className="px-6 py-4">Income</th>
                                            <th scope="col" className="px-6 py-4">Expense</th>
                                            <th scope="col" className="px-6 py-4">Payment Method</th>
                                            <th scope="col" className="px-6 py-4">Transaction No</th>
                                            <th scope="col" className="px-6 py-4">Date</th>
                                            <th scope="col" className="px-6 py-4">Category</th>
                                            <th scope="col" className="px-6 py-4">Vendor/Client</th>
                                            <th scope="col" className="px-6 py-4">Remarks</th>
                                            <th scope="col" className="px-6 py-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expenseData?.map((el, i) => (
                                            <tr className="border-b" key={i}>
                                                <td className="whitespace-nowrap px-6 py-4 font-medium">{i + 1}</td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    {el.description}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 font-semibold text-green-600">
                                                    {el.transaction_type === 'Income' ? el.amount : '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 font-semibold text-red-600">
                                                    {el.transaction_type === 'Expense' ? el.amount : '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    {el.payment_method}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">{el.transaction_no}</td>
                                                <td className="whitespace-nowrap px-6 py-4">{el.date}</td>
                                                <td className="whitespace-nowrap px-6 py-4">{el.category}</td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    {el.vendor_or_client}</td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    {el.remarks}</td>
                                                <td className="px-6 py-4 text-right flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setRows(el)
                                                            setEditMode(true)
                                                        }}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm py-2 px-3 rounded-md"
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


ListExpense.propTypes = {
    id: PropTypes.string.isRequired,  // Assuming id is a string
    type: PropTypes.string.isRequired,  // Assuming id is a string
};

export default ListExpense;
