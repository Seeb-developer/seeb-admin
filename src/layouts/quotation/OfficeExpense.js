import React, { useEffect, useState } from 'react';
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
import EditExpenseForm from './component/EditExpenseForm';

const OfficeExpense = () => {
    const location = useLocation();
    const type = location.state?.type

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
    const [editMode, setEditMode] = useState(false); // New state for edit mode
    const [row, setRows] = useState({})
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [categoryWiseExpenses, setCategoryWiseExpenses] = useState({});
    const [editRow, setEditRow] = useState(null);

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
            quotation_id: null,
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

    const calculateSummary = (data) => {
        let income = 0;
        let expense = 0;
        const categorySummary = {};

        data?.forEach((item) => {
            const amount = parseFloat(item.amount);
            if (item.transaction_type === "Income") {
                income += amount;
            } else if (item.transaction_type === "Expense") {
                expense += amount;

                if (item.category) {
                    categorySummary[item.category] = (categorySummary[item.category] || 0) + amount;
                }
            }
        });

        setTotalIncome(income.toFixed(2));
        setTotalExpense(expense.toFixed(2));

        const formattedCategorySummary = {};
        for (const [category, amount] of Object.entries(categorySummary)) {
            formattedCategorySummary[category] = amount.toFixed(2);
        }

        setCategoryWiseExpenses(formattedCategorySummary);
    };

    const getAllExpenses = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({ type });

        const requestOptions = {
            method: "POST",  // Use PUT for editing, POST for adding new
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };


        await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + `transactions/office-expense`, requestOptions)
            .then(response => response.json())
            .then(result => {
                setLoader(false);
                setExpenseData(result.data);
                calculateSummary(result.data);
            })
            .catch(error => console.log('Error fetching expenses:', error))
            .finally(() => setLoader(false))
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
            .catch(error => console.error("Error updating expense:", error));
    };

    useEffect(() => {
        setLoader(true);
        getAllExpenses();
    }, [type]);

    // Function to download as Excel
    const downloadExcel = () => {
        const ws = XLSX.utils.json_to_sheet(expenseData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Expenses");
        XLSX.writeFile(wb, "expenses.xlsx");
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
                    {/* Summary Section */}
                    <div className="px-8 py-4 bg-gray-100 rounded-md">
                        <h2 className="text-lg font-semibold mb-4">Summary</h2>
                        <div className="flex justify-between">
                            <div className="text-green-600">
                                <strong>Total Income:</strong> ₹{totalIncome}
                            </div>
                            <div className="text-red-600">
                                <strong>Total Expense:</strong> ₹{totalExpense}
                            </div>
                            <div className="flex justify-between">
                                <div className={`${totalIncome - totalExpense >= 0 ? "text-green-600" : "text-red-600"}`}>
                                    <strong>{totalIncome - totalExpense >= 0 ? "Profit:" : "Loss:"}</strong> ₹{(totalIncome - totalExpense).toFixed(2)}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="font-medium">Category-wise Expenses:</h3>
                            <ul className="list-disc pl-5">
                                {Object.entries(categoryWiseExpenses)?.map(([category, amount]) => (
                                    <li key={category}>
                                        {category}: ₹{amount}
                                    </li>
                                ))}
                            </ul>
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

                    <hr></hr>
                    <div style={{ fontSize: 15 }} className="px-8 mt-5">
                        List Expenses
                    </div>
                    <div className="flex items-center">
                        <div className="relative w-1/2 m-4">
                            <input
                                type="text"
                                id="simple-search"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="Search expenses..."
                                required
                            />
                        </div>
                        {/* Download Buttons */}
                        <div className="flex justify-end">
                            <button onClick={downloadExcel} className="bg-blue-500 text-sm text-white py-2 px-4 rounded-md mr-2">Download Excel</button>
                            {/* <button onClick={downloadPDF} className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2">Download PDF</button> */}
                            {/* <button onClick={downloadCSV} className="bg-blue-500 text-white py-2 px-4 rounded-md">Download CSV</button> */}
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
                                                        <td className="whitespace-normal break-words px-6 py-4 max-w-xs">

                                                            <span className="block">{el.description}</span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 font-semibold text-green-600">
                                                            {el.transaction_type === 'Income' ? el.amount : '-'}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 font-semibold text-red-600">
                                                            {el.transaction_type === 'Expense' ? el.amount : '-'}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4">{el.payment_method}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{el.transaction_no}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{el.date}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{el.category}</td>
                                                        <td className="whitespace-normal break-words px-6 py-4 max-w-xs">{el.vendor_or_client}</td>
                                                        <td className="whitespace-normal break-words px-6 py-4 max-w-xs">{el.remarks}</td>
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
            )}
        </DashboardLayout>
    );
};

export default OfficeExpense;
