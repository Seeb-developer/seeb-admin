import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Toaster, toast } from "react-hot-toast";

// Modals (we will create these next)
import UpdateAddressModal from "./modals/UpdateAddressModal";
// import UpdateSlotModal from "./modals/UpdateSlotModal";
// import UpdateCouponModal from "./modals/UpdateCouponModal";
import EditServiceModal from "./modals/EditServiceModal";
// import AddServiceModal from "./modals/AddServiceModal";
import PropTypes from "prop-types";
import { apiCall } from "utils/apiClient";


const UpdateBookingPage = () => {
    const { id } = useParams();
    const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(null);
    const [services, setServices] = useState([]);
    // Modal controls
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showSlotModal, setShowSlotModal] = useState(false);
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [editService, setEditService] = useState(null);
    const [showAddService, setShowAddService] = useState(false);
    
    const navigate = useNavigate();
    /* ---------------- FETCH BOOKING ---------------- */
    const fetchBooking = async () => {
        try {
            setLoading(true);
            // fetch(`${BASE_URL}booking/${id}`);
            const res = await apiCall({
                endpoint: `booking/${id}`,
                method: "GET",
            });
            console.log("Booking Details:", res);
            if (res.status === 200) {
                setBooking(res.data.booking);
                setServices(res.data.services);
            } else {
                toast.error("Failed to load booking");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooking();
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout>
                <DashboardNavbar />
                <div className="flex justify-center items-center h-[70vh]">
                    <Spin indicator={antIcon} />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" />

            <div className="mx-6 mt-6 space-y-6">

                {/* ---------------- BOOKING SUMMARY ---------------- */}
                <Card title="Booking Summary">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Info label="Booking ID" value={booking?.booking_id} />
                        <Info label="Customer" value={booking?.user_name} />
                        <Info label="Mobile" value={booking?.mobile_no} />
                        <Info label="Slot Date" value={booking?.slot_date} />
                        <Info label="Status" value={booking?.status} />
                    </div>
                </Card>


                {/* ---------------- CUSTOMER ADDRESS ---------------- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* CUSTOMER ADDRESS */}
                    <Card
                        title="Customer Address"
                        actionLabel="Edit Address"
                        onAction={() => setShowAddressModal(true)}
                    >
                        <p className="text-sm text-gray-700">
                            {booking?.customer_address}
                        </p>
                    </Card>

                    {/* SLOT DATE */}
                    <Card
                        title="Slot Date"
                        actionLabel="Change Slot"
                        onAction={() => setShowSlotModal(true)}
                    >
                        <p className="text-sm">
                            {booking?.slot_date}
                        </p>
                    </Card>

                    {/* COUPON */}
                    <Card
                        title="Coupon"
                        actionLabel="Update Coupon"
                        onAction={() => setShowCouponModal(true)}
                    >
                        <p className="text-sm">
                            {booking?.applied_coupon || "No coupon applied"}
                        </p>
                    </Card>

                </div>

                {/* ---------------- SERVICES ---------------- */}
                <Card
                    title="Services"
                    actionLabel="Add Service"
                    onAction={() => navigate(`/bookings/${booking.id}/add-service`)}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 border border-gray-300">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                <tr>
                                    <th className="py-3 px-4">Sr No</th>
                                    <th className="py-3 px-4">Service Name</th>
                                    <th className="py-3 px-4">Rate Type</th>
                                    <th className="py-3 px-4">Size / Qty</th>
                                    <th className="py-3 px-4">Rate (₹)</th>
                                    <th className="py-3 px-4">Amount (₹)</th>
                                    {/* <th className="py-3 px-4">Action</th> */}
                                </tr>
                            </thead>

                            <tbody>
                                {services?.length > 0 ? (
                                    services?.map((service, index) => {
                                        const addons = service?.addons
                                            ? JSON.parse(service?.addons)
                                            : [];

                                        // 🔢 Amount calculation (supports square_feet)
                                        const calculateAmount = () => {
                                            const rate = parseFloat(service?.rate || 0);

                                            if (
                                                service?.rate_type === "square_feet" &&
                                                typeof service?.value === "string" &&
                                                service?.value.includes("X")
                                            ) {
                                                const [w, h] = service?.value
                                                    .split("X")
                                                    .map((v) => parseFloat(v.trim()) || 0);
                                                return (w * h * rate).toFixed(2);
                                            }

                                            return (
                                                parseFloat(service?.value || 0) * rate
                                            ).toFixed(2);
                                        };

                                        const serviceAmount = calculateAmount();

                                        return (
                                            <React.Fragment key={service?.id}>
                                                {/* MAIN SERVICE ROW */}
                                                <tr className="bg-white border-b hover:bg-gray-50">
                                                    <td className="py-3 px-4 font-medium">
                                                        {index + 1}
                                                    </td>
                                                    <td className="py-3 px-4 font-semibold">
                                                        {service?.service_name}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {service?.rate_type}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {service?.value}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        ₹{service?.rate}
                                                    </td>
                                                    <td className="py-3 px-4 font-semibold">
                                                        ₹{serviceAmount}
                                                    </td>
                                                    {/* <td className="py-3 px-4">
                                                        <button
                                                            onClick={() => setEditService(service)}
                                                            className="text-blue-600 text-sm"
                                                        >
                                                            Edit
                                                        </button>
                                                    </td> */}
                                                </tr>

                                                {/* ADDON HEADER */}
                                                {addons.length > 0 && (
                                                    <tr className="bg-gray-100 text-xs font-semibold text-gray-700 border-b">
                                                        <td></td>
                                                        <td className="py-2 px-4">
                                                            Addon Name
                                                        </td>
                                                        <td className="py-2 px-4">
                                                            Qty
                                                        </td>
                                                        <td className="py-2 px-4">
                                                            Unit Price
                                                        </td>
                                                        <td className="py-2 px-4">
                                                            Price Type
                                                        </td>
                                                        <td className="py-2 px-4">
                                                            Total
                                                        </td>
                                                        <td></td>
                                                    </tr>
                                                )}

                                                {/* ADDON ROWS */}
                                                {addons?.map((addon, i) => (
                                                    <tr
                                                        key={i}
                                                        className="bg-gray-50 text-sm border-b"
                                                    >
                                                        <td></td>
                                                        <td className="py-2 px-4">
                                                            {addon?.name}
                                                        </td>
                                                        <td className="py-2 px-4">
                                                            {addon?.qty}
                                                        </td>
                                                        <td className="py-2 px-4">
                                                            ₹{addon?.price}
                                                        </td>
                                                        <td className="py-2 px-4">
                                                            {addon?.price_type}
                                                        </td>
                                                        <td className="py-2 px-4 font-medium">
                                                            ₹{addon?.total}
                                                        </td>
                                                        <td></td>
                                                    </tr>
                                                ))}

                                                {/* SERVICE TOTAL */}
                                                <tr className="bg-green-50 font-semibold text-green-800 border-b">
                                                    <td></td>
                                                    <td
                                                        className="py-2 px-4"
                                                        colSpan={4}
                                                    >
                                                        Total (Service + Addons)
                                                    </td>
                                                    <td className="py-2 px-4">
                                                        ₹{service?.amount}
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="py-4 text-center text-gray-500"
                                        >
                                            No services found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>


                {/* ---------------- PRICE SUMMARY ---------------- */}
                <Card title="Price Summary">
                    <PriceRow label="Total Amount" value={booking?.total_amount} />
                    <PriceRow label="Discount" value={booking?.discount} />
                    <PriceRow label="CGST" value={booking?.cgst} />
                    <PriceRow label="SGST" value={booking?.sgst} />
                    <PriceRow label="Final Amount" value={booking?.final_amount} bold />
                </Card>
            </div>

            {/* ---------------- MODALS ---------------- */}
            {showAddressModal && (
                <UpdateAddressModal
                    booking={booking}
                    onClose={(refresh) => {
                        setShowAddressModal(false);
                        if (refresh) fetchBooking();
                    }}
                />
            )}
            {/* 
      {showSlotModal && (
        <UpdateSlotModal
          booking={booking}
          onClose={(refresh) => {
            setShowSlotModal(false);
            if (refresh) fetchBooking();
          }}
        />
      )} */}

            {/* {showCouponModal && (
        <UpdateCouponModal
          booking={booking}
          onClose={(refresh) => {
            setShowCouponModal(false);
            if (refresh) fetchBooking();
          }}
        />
      )} */}

            {/* {editService && (
                <EditServiceModal
                    service={editService}
                    onClose={(refresh) => {
                        setEditService(null);
                        if (refresh) fetchBooking();
                    }}
                />
            )} */}

            {/* {showAddService && (
        <AddServiceModal
          bookingId={booking.id}
          onClose={(refresh) => {
            setShowAddService(false);
            if (refresh) fetchBooking();
          }}
        />
      )} */}
        </DashboardLayout>
    );
};

/* ---------------- SMALL UI COMPONENTS ---------------- */

const Card = ({ title, children, actionLabel, onAction }) => (
    <div className="bg-white rounded shadow p-4">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">{title}</h3>
            {actionLabel && (
                <button
                    onClick={onAction}
                    className="text-sm text-blue-600"
                >
                    {actionLabel}
                </button>
            )}
        </div>
        {children}
    </div>
);

Card.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    actionLabel: null,
    onAction: null,
};

const Info = ({ label, value }) => (
    <div className="text-sm mb-1">
        <span className="font-medium">{label}:</span> {value}
    </div>
);

Info.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
};

const PriceRow = ({ label, value, bold }) => (
    <div className={`flex justify-between text-sm ${bold ? "font-semibold" : ""}`}>
        <span>{label}</span>
        <span>₹ {value}</span>
    </div>
);

PriceRow.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    bold: PropTypes.bool,
};

export default UpdateBookingPage;
