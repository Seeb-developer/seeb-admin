import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import toast, { Toaster } from 'react-hot-toast';
import PaymentRequestModal from './PaymentRequestModal';
import AddPaymentModal from './AddPaymentModal';
import AddExpensesModal from './AddExpensesModal';

const BookingDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingId = location.state?.booking_id;
    const [bookingData, setBookingData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [modalType, setModalType] = useState("");

    const openModal = (type) => setModalType(type);
    const closeModal = () => setModalType("");

    const fetchBookingDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}booking/${bookingId}`);
            const result = await response.json();
            if (result.status === 200) {
                setBookingData(result.data);
            }
        } catch (error) {
            console.error('Error fetching booking details:', error);
        }
        setLoading(false);
    };
    useEffect(() => {

        fetchBookingDetails();
    }, [bookingId]);

    const handleDelete = async (requestId) => {
        if (!window.confirm("Are you sure you want to delete this payment request?")) return;

        try {
            const response = await fetch(
                `${process.env.REACT_APP_HAPS_MAIN_BASE_URL}payment/request/delete/${requestId}`,
                { method: "DELETE" }
            );

            const result = await response.json();

            if (result.status === 200) {
                toast.success("Payment request deleted successfully!");
                // Refresh booking data to reflect changes
                fetchBookingDetails();
            } else {
                toast.success(result.message || "Failed to delete request");
            }
        } catch (error) {
            console.error("Error deleting payment request:", error);
        }
    };


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" reverseOrder={false} />
            {loading ? (
                <div className="flex justify-center items-center h-[75vh] w-full">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
                </div>
            ) : (
                <div className="border-solid border-2 black-indigo-600 mt-6 p-6 bg-white shadow-lg rounded-lg">
                    <div className='flex items-center justify-between'>
                        <h2 className="px-8 mt-5 text-lg font-semibold">Booking Details</h2>
                        <button
                            onClick={() => navigate('/assign-worker', {
                                state: { booking: bookingData }
                            })}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-1 rounded"
                        >
                            Assign Worker
                        </button>
                    </div>
                    {/* Booking Info Section */}
                    <div className="px-8 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-3">User Details</h3>
                                <p><strong>Booking ID:</strong> {bookingData?.booking?.id}</p>
                                <p><strong>Customer Name:</strong> {bookingData?.booking?.user_name}</p>
                                <p><strong>Customer Email:</strong>{bookingData?.booking?.user_email}</p>
                                <p><strong>Phone:</strong> {bookingData?.booking?.mobile_no}</p>
                                <p><strong>Address:</strong> {bookingData?.booking?.customer_address}, {bookingData?.booking?.customer_city}, {bookingData?.booking?.customer_state}, {bookingData?.booking?.customer_zipcode}</p>
                                <p><strong>Status:</strong> <span className="text-green-600">{bookingData?.booking?.status}</span></p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Payment Details</h3>
                                <p><strong>Total Amount:</strong> ₹{bookingData?.booking?.total_amount}</p>
                                <p><strong>Discount:</strong> ₹{bookingData?.booking?.discount}</p>
                                <p><strong>Final Amount:</strong> ₹{bookingData?.booking?.final_amount}</p>
                                <p><strong>Paid Amount:</strong> ₹{bookingData?.booking?.paid_amount}</p>
                                <p><strong>Amount Due:</strong> ₹{bookingData?.booking?.amount_due}</p>
                                <p><strong>Payment Type:</strong> {bookingData?.booking?.payment_type}</p>
                                <p><strong>Created At:</strong> {bookingData?.booking?.created_at}</p>
                            </div>
                        </div>
                    </div>

                    {/* Services Table */}
                    <div className="px-8 mt-8">
                        <h2 className="text-xl font-semibold mb-4">Services</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 border border-gray-300">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                    <tr>
                                        <th className="py-4 px-6">Sr No</th>
                                        <th className="py-4 px-6">Service Name</th>
                                        <th className="py-4 px-6">Rate Type</th>
                                        <th className="py-4 px-6">Size</th>
                                        <th className="py-4 px-6">Rate (₹)</th>
                                        <th className="py-4 px-6">Amount (₹)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookingData?.services?.length > 0 ? (
                                        bookingData.services.map((service, index) => {
                                            const addons = service.addons ? JSON.parse(service.addons) : [];
                                            const addonTotal = addons.reduce((sum, a) => sum + parseFloat(a.total), 0);
                                            // const finalAmount = parseFloat(service.amount) + addonTotal;

                                            return (
                                                <React.Fragment key={service.service_id}>
                                                    {/* Main Service Row */}
                                                    <tr className="bg-white border-b hover:bg-gray-50">
                                                        <td className="py-4 px-6 font-bold">{index + 1}</td>
                                                        <td className="py-4 px-6 font-semibold">{service.service_name}</td>
                                                        <td className="py-4 px-6">{service.rate_type}</td>
                                                        <td className="py-4 px-6">{service.value}</td>
                                                        <td className="py-4 px-6">₹{service.rate}</td>
                                                        <td className="py-4 px-6 font-semibold">
                                                            ₹
                                                            {(() => {
                                                                const rate = parseFloat(service.rate || 0);
                                                                let total = 0;

                                                                if (service.rate_type === "square_feet" && service.value?.includes("X")) {
                                                                    const [w, h] = service.value.split("X").map(v => parseFloat(v.trim()) || 0);
                                                                    total = w * h * rate;
                                                                } else {
                                                                    const quantity = parseFloat(service.value || 0);
                                                                    total = quantity * rate;
                                                                }

                                                                return total.toFixed(2);
                                                            })()}
                                                        </td>                                                      
                                                    </tr>

                                                    {/* Addon Header */}
                                                    {addons.length > 0 && (
                                                        <tr className="bg-gray-100 text-sm text-gray-700 font-semibold border-b">
                                                            <td></td>
                                                            <td className="py-2 px-6">Addon Name</td>
                                                            <td className="py-2 px-6">Qty</td>
                                                            <td className="py-2 px-6">Unit Price</td>
                                                            <td className="py-2 px-6">Price Type</td>
                                                            <td className="py-2 px-6">Total</td>
                                                        </tr>
                                                    )}

                                                    {/* Addon Rows */}
                                                    {addons.map((addon, i) => (
                                                        <tr key={i} className="bg-gray-50 text-sm border-b">
                                                            <td></td>
                                                            <td className="py-2 px-6">{addon.name}</td>
                                                            <td className="py-2 px-6">{addon.qty}</td>
                                                            <td className="py-2 px-6">₹{addon.price}</td>
                                                            <td className="py-2 px-6">{addon.price_type}</td>
                                                            <td className="py-2 px-6">₹{addon.total}</td>
                                                        </tr>
                                                    ))}

                                                    {/* Final Total */}
                                                    <tr className="bg-green-50 font-bold text-green-800 border-b">
                                                        <td></td>
                                                        <td className="py-3 px-6" colSpan="4">Total (Service + Addons)</td>
                                                        <td className="py-3 px-6">₹{service.amount}</td>
                                                    </tr>
                                                </React.Fragment>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-4 text-center">No services found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                        </div>
                    </div>

                    {/* Payments Table */}
                    <div className="px-8 mt-8">

                        {/* Buttons for Payment Request and Add Payment */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold">Payments</h2>
                            <div className="flex space-x-3">
                                <button
                                    className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all"
                                    onClick={() => openModal("addPayment")}
                                >
                                    ➕ Add Payment
                                </button>
                            </div>
                        </div>

                        {/* Payments Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 border border-gray-300">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-6">Sr No</th>
                                        <th className="py-3 px-6">Amount (₹)</th>
                                        <th className="py-3 px-6">Payment Method</th>
                                        <th className="py-3 px-6">Status</th>
                                        <th className="py-3 px-6">Transaction ID</th>
                                        <th className="py-3 px-6">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookingData?.payments?.length > 0 ? (
                                        bookingData.payments.map((payment, index) => (
                                            <tr className="bg-white border-b hover:bg-gray-50" key={payment.transaction_id}>
                                                <td className="py-4 px-6 font-semibold">{index + 1}</td>
                                                <td className="py-4 px-6 font-semibold">{payment.amount}</td>
                                                <td className="py-4 px-6">{payment.payment_method}</td>
                                                <td className="py-4 px-6">
                                                    <span className={`px-2 py-1 rounded-full text-white text-sm ${payment.payment_status === 'completed' ? 'bg-green-600' : 'bg-red-600'}`}>
                                                        {payment.payment_status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">{payment.transaction_id}</td>
                                                <td className="py-4 px-6">{payment.created_at}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-4 text-center">No payments found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* {bookingData?.booking?.status === 'pending' && */}
                    <div className="px-8 mt-8">

                        {/* Buttons for Payment Request and Add Payment */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold">Payments Request</h2>
                            <div className="flex space-x-3">
                                <button
                                    className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
                                    onClick={() => openModal("paymentRequest")}
                                >
                                    📩 Add Payment Request
                                </button>
                            </div>
                        </div>

                        {/* Payments Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 border border-gray-300">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-6">Sr No</th>
                                        <th className="py-3 px-6">Amount (₹)</th>
                                        <th className="py-3 px-6">Status</th>
                                        <th className="py-3 px-6">Date</th>
                                        <th className="py-3 px-6">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookingData?.payment_requests?.length > 0 ? (
                                        bookingData.payment_requests.map((payment, index) => (
                                            <tr className="bg-white border-b hover:bg-gray-50" key={payment.transaction_id}>
                                                <td className="py-4 px-6 font-semibold">{index + 1}</td>
                                                <td className="py-4 px-6 font-semibold">{payment.amount}</td>
                                                <td className="py-4 px-6">
                                                    <span className={`px-2 py-1 rounded-full text-white text-sm ${payment.request_status === 'completed' ? 'bg-green-600' : 'bg-red-600'}`}>
                                                        {payment.request_status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">{payment.created_at}</td>
                                                <td className="py-4 px-6 flex space-x-2">
                                                    {payment.request_status !== 'completed' && (
                                                        <button
                                                            onClick={() => handleCancel(payment.id)}
                                                            className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(payment.id)}
                                                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-4 text-center">No payments found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* } */}

                    <div className="px-8 mt-8">
                        {/* Expenses Header with Add Button */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold">Expenses</h2>
                            <button
                                className="bg-red-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-700 transition-all"
                                onClick={() => openModal("addExpense")}
                            >
                                ➕ Add Expenses
                            </button>
                        </div>

                        {/* Expenses Table */}
                        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                            <table className="w-full text-sm text-left text-gray-700 border border-gray-300">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-6">Sr No</th>
                                        <th className="py-3 px-6">Amount (₹)</th>
                                        <th className="py-3 px-6">Payment Method</th>
                                        {/* <th className="py-3 px-6">Status</th> */}
                                        <th className="py-3 px-6">Transaction ID</th>
                                        <th className="py-3 px-6">Description</th>
                                        <th className="py-3 px-6">Vendor</th>
                                        <th className="py-3 px-6">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookingData?.expenses?.length > 0 ? (
                                        bookingData.expenses.map((expense, index) => (
                                            <tr className="bg-white border-b hover:bg-gray-50 transition-all" key={expense.id}>
                                                <td className="py-4 px-6 font-semibold">{index + 1}</td>
                                                <td className="py-4 px-6 font-semibold">{expense.amount}</td>
                                                <td className="py-4 px-6">{expense.payment_method}</td>
                                                {/* <td className="py-4 px-6">
                                                    <span className={`px-2 py-1 rounded-full text-white text-sm ${payment.payment_status === 'completed' ? 'bg-green-600' : 'bg-red-600'}`}>
                                                        {payment.payment_status}
                                                    </span>
                                                </td> */}
                                                <td className="py-4 px-6">{expense.transaction_id}</td>
                                                <td className="py-4 px-6">{expense.description}</td>
                                                <td className="py-4 px-6">{expense.vendor_or_client}</td>
                                                <td className="py-4 px-6">{expense.created_at}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-4 text-center text-gray-500">No expenses found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Modals */}
                    {modalType === "paymentRequest" && <PaymentRequestModal
                        onClose={closeModal}
                        bookingId={bookingData?.booking?.id}
                        userId={bookingData?.booking?.user_id}
                        onSubmit={() => fetchBookingDetails()}
                    />}
                    {modalType === "addPayment" && <AddPaymentModal
                        onClose={closeModal}
                        bookingId={bookingData?.booking?.id}
                        userId={bookingData?.booking?.user_id}
                        onSubmit={() => fetchBookingDetails()}
                    />}
                    {modalType === "addExpense" && <AddExpensesModal
                        onClose={closeModal}
                        bookingId={bookingData?.booking?.id}
                        userId={bookingData?.booking?.user_id}
                        onSubmit={() => fetchBookingDetails()}
                    />}
                </div>
            )}
        </DashboardLayout>
    );
};

export default BookingDetails;
