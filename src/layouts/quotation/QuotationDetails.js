import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import toast, { Toaster } from 'react-hot-toast';
import ExpenseForm from './component/ExpenseForm';
import ListExpense from './ListExpense';

const QuotationDetails = () => {
    const location = useLocation();

    const quotationData = location.state?.quotation || {};
    const type = location.state?.type || {};
    const [selectedTab, setSelectedTab] = useState('')
    const navigate = useNavigate();

    const BackToListQuotation = () => {
        navigate("/freePik");
    }


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" reverseOrder={false} />

            <div className="border-solid border-2 p-6 mt-6 rounded-md shadow-md bg-white">
                <h2 className="text-lg font-bold mb-4">Quotation Details</h2>

                {/* Main Grid Row for Customer and Payment Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Customer Details */}
                    <div className="w-full">
                        <h3 className="text-md font-semibold mb-2">Customer Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <p className="text-sm"><span className="font-semibold">Name:</span> {quotationData.customer_name}</p>
                            <p className="text-sm"><span className="font-semibold">Phone:</span> {quotationData.phone}</p>
                            <p className="text-sm"><span className="font-semibold">Address:</span> {quotationData.address}</p>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="w-full">
                        <h3 className="text-md font-semibold mb-2">Payment Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <p className="text-sm"><span className="font-semibold">Total Amount:</span> ₹{quotationData.total}</p>
                            <p className="text-sm"><span className="font-semibold">Discount:</span> {quotationData.discount}%</p>
                            <p className="text-sm"><span className="font-semibold">Discount Amount:</span> ₹{quotationData.discount_amount}</p>
                            <p className="text-sm"><span className="font-semibold">SGST:</span> ₹{quotationData.sgst}</p>
                            <p className="text-sm"><span className="font-semibold">CGST:</span> ₹{quotationData.cgst}</p>
                            <p className="text-sm"><span className="font-semibold">Grand Total:</span> ₹{quotationData.grand_total}</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 mb-4">
                    <button
                        onClick={() => setSelectedTab('income')}
                        className={`px-4 py-2 rounded-md font-semibold transition ${selectedTab === 'income' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                    >
                        Transactions
                    </button>
                    <button
                        onClick={() => BackToListQuotation()}
                        className={`px-4 py-2 rounded-md font-semibold transition ${selectedTab === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                    >
                        Invoices
                    </button>
                </div>
                <ListExpense id={quotationData.id} type={type} />


            </div>



        </DashboardLayout>
    );
}

export default QuotationDetails;
