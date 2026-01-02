import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Toaster, toast } from 'react-hot-toast';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { apiCall } from "utils/apiClient";
import AdminAddServiceModal from "./modals/AdminAddServiceModal";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const CreateBookingPage = () => {
    /* ---------------- STATE ---------------- */
    const [customers, setCustomers] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [services, setServices] = useState([]);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [slotDate, setSlotDate] = useState("");

    const [serviceTypeId, setServiceTypeId] = useState(null);
    const [roomId, setRoomId] = useState(null);

    const [booking, setBooking] = useState(null);

    const [selectedService, setSelectedService] = useState(null);
    const [showAddService, setShowAddService] = useState(false);
    const [data, setData] = useState([]);

    /* TEMP SUMMARY (UI ONLY) */
    const [subtotal, setSubtotal] = useState(0);
    const [manualDiscount, setManualDiscount] = useState(0);
    const [coupon, setCoupon] = useState(null);

    /* SEARCH STATE */
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const navigate = useNavigate();


    /* DEBOUNCE SEARCH */
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    /* ---------------- LOAD INITIAL DATA & SEARCH ---------------- */
    useEffect(() => {
        const fetchData = async () => {
            const body = {
                page: 1,
                limit: 50,
                search: debouncedSearch || undefined,
            };

            const result = await apiCall({ endpoint: "customer/getCustomer", method: "POST", data: body });
            if (result?.status === 200) {
                setCustomers(result.data || []);
            }
        };

        fetchData();
    }, [debouncedSearch]);

    useEffect(() => {
        const fetchServiceTypes = async () => {
            const result = await apiCall({ endpoint: "services-type" });
            if (result?.status === 200) {
                setServiceTypes(result.data || []);
            }
        };

        fetchServiceTypes();
    }, []);
    // apiCall({ endpoint: "rooms" }).then(r => r?.status === 200 && setRooms(r.data));

    /* ---------------- LOAD ADDRESSES ---------------- */
    useEffect(() => {
        if (!selectedCustomer) return;

        const fetchAddresses = async () => {
            const result = await apiCall({
                endpoint: `customer-address/${selectedCustomer.value}`,
            });
            // console.log("Addresses API Result:", result);
            if (result?.status === 200) {
                setAddresses(result.data || []);
                // Auto-select default address
                const defaultAddress = result.data?.find(addr => addr.is_default === "1" || addr.is_default === 1);
                if (defaultAddress) {
                    setSelectedAddress(defaultAddress.id);
                }
            }
        };

        fetchAddresses();
    }, [selectedCustomer]);

    /* ---------------- LOAD SERVICES ---------------- */
    useEffect(() => {
        if (!serviceTypeId || !roomId) return;

        const fetchServices = async () => {
            const result = await apiCall({
                endpoint: `services/service-type/${serviceTypeId}/room/${roomId}`,
                method: "GET",
            });
            if (result?.status === 200) {
                setServices(result.data || []);
            }
        };

        fetchServices();
    }, [serviceTypeId, roomId]);

    /* ---------------- LOAD Rooms ---------------- */
    useEffect(() => {
        if (!serviceTypeId) return;

        const fetchServices = async () => {
            const result = await apiCall({
                endpoint: `services-type/${serviceTypeId}/rooms`,
            });
            if (result?.status === 200) {
                setRooms(result.data || []);
            }
        };

        fetchServices();
    }, [serviceTypeId]);

    /* ---------------- CREATE BOOKING ---------------- */
    const handleCreateBooking = async () => {
        if (!selectedCustomer || !selectedAddress || !slotDate) {
            toast.error("Customer, address and slot date required");
            return;
        }

        const res = await apiCall({
            endpoint: "booking/create-by-admin",
            method: "POST",
            data: {
                user_id: selectedCustomer.value,
                address_id: selectedAddress,
                slot_date: slotDate,
                services: data,
                discount_amount: manualDiscount,
                coupon_code: coupon ? coupon.value : null,
                created_by_role: "admin",
                created_by_id: localStorage.getItem("id"),

            },
        });
        console.log("Create Booking Response:", res);
        if (res.status == 201) {
            toast.success("Booking created");
            navigate(-1);
            // setBooking(res.data);
        } else {
            const errorMessage = res?.message || "Failed to create booking";
            toast.error(errorMessage);
        }
    };

    /* ---------------- OPTIONS ---------------- */
    const customerOptions = customers.map(c => ({
        value: c.id,
        label: `${c.name} (${c.mobile_no})`,
    }));

    const finalTotal = Math.max(
        0,
        subtotal - manualDiscount
    );

    /* ===================================================== */

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" reverseOrder={false} />
            <div className="mx-6 mt-6 space-y-6">

                {/* ================= ROW 1 ================= */}
                {/* CUSTOMER | ADDRESS | SLOT */}
                <Card title="1. Select Customer, Address & Slot">
                    <div className="grid grid-cols-12 gap-3 items-end">
                        <div className="col-span-4">
                            <label className="text-xs font-medium">Customer</label>
                            <Select
                                options={customerOptions}
                                value={selectedCustomer}
                                onChange={(opt) => {
                                    setSelectedCustomer(opt);
                                    setSelectedAddress(null);
                                    setAddresses([]);
                                }}
                                onInputChange={(inputValue) => setSearchTerm(inputValue)}
                                inputValue={searchTerm}
                                placeholder="Search name / mobile"
                                isClearable
                                isSearchable
                            />
                        </div>

                        <div className="col-span-5">
                            <label className="text-xs font-medium">Address</label>
                            <select
                                value={selectedAddress || ""}
                                onChange={(e) => setSelectedAddress(Number(e.target.value))}
                                className="w-full text-sm bg-white border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select an address</option>
                                {addresses.map(a => (
                                    <option key={a.id} value={a.id}>
                                        {a.address_label} - {a.house} {a.is_default === "1" || a.is_default === 1 ? "(Default)" : ""}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-3">
                            <label className="text-xs font-medium">Slot Date</label>
                            <input
                                type="date"
                                value={slotDate}
                                onChange={(e) => setSlotDate(e.target.value)}
                                className="border rounded px-3 py-2 w-full text-sm"
                            />
                        </div>
                    </div>
                </Card>
                {/* ================= ROW 2 ================= */}
                {/* SERVICE TYPE | ROOM */}
                <Card title="2. Select Service Type & Room">
                    <div className="grid grid-cols-12 gap-3">

                        <div className="col-span-6">
                            <label className="text-xs font-medium">Service Type</label>
                            <div className="flex gap-2 flex-wrap mt-1">
                                {serviceTypes.map(st => (
                                    <button
                                        key={st.id}
                                        onClick={() => setServiceTypeId(st.id)}
                                        className={`px-3 py-1 border rounded text-sm
                    ${serviceTypeId === st.id ? "bg-blue-600 text-white" : ""}
                  `}
                                    >
                                        {st.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="col-span-6">
                            <label className="text-xs font-medium">Room</label>
                            <div className="flex gap-2 flex-wrap mt-1">
                                {rooms.map(r => (
                                    <button
                                        key={r.id}
                                        onClick={() => setRoomId(r.id)}
                                        className={`px-3 py-1 border rounded text-sm
                    ${roomId === r.id ? "bg-green-600 text-white" : ""}
                  `}
                                    >
                                        {r.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
                {/* ================= ROW 3 ================= */}
                {/* SERVICES GRID */}
                <div>
                    <Card title="3. Select Services to Add">
                        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3 mt-2">
                            {services.map(service => {
                                const images = JSON.parse(service.image || "[]");
                                return (
                                    <div
                                        key={service.id}
                                        onClick={() => {
                                            setSelectedService(service);
                                            setShowAddService(true);
                                        }}
                                        className="border rounded p-2 cursor-pointer hover:border-blue-600"
                                    >
                                        <img
                                            src={
                                                images[0]
                                                    ? `${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${images[0]}`
                                                    : "/placeholder.png"
                                            }
                                            alt={service.name}
                                            className="h-24 w-full object-cover rounded"
                                        />
                                        <div className="mt-1 text-sm font-medium">{service.name}</div>
                                        <div className="text-xs text-gray-500">
                                            ₹{service.rate} / {service.rate_type}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* ================= ROW 4 ================= */}
                {/* SUMMARY & DISCOUNT */}
                <Card title="4. Added Services List">
                    {data && Array.isArray(data) && data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2 px-3 font-semibold">Service</th>
                                        <th className="text-left py-2 px-3 font-semibold">Value</th>
                                        <th className="text-left py-2 px-3 font-semibold">Rate</th>
                                        <th className="text-right py-2 px-3 font-semibold">Base</th>
                                        <th className="text-right py-2 px-3 font-semibold">Addons</th>
                                        <th className="text-right py-2 px-3 font-semibold">Total</th>
                                        <th className="text-center py-2 px-3 font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((service, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-3 font-medium">{service.name}</td>
                                            <td className="py-3 px-3">{service.value}</td>
                                            <td className="py-3 px-3">₹{service.rate}</td>
                                            <td className="py-3 px-3 text-right">₹{service.baseTotal || 0}</td>
                                            <td className="py-3 px-3 text-right">₹{service.addonTotal || 0}</td>
                                            <td className="py-3 px-3 text-right font-semibold text-red-600">
                                                ₹{service.total}
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                <button
                                                    onClick={() => {
                                                        setData((prev) =>
                                                            prev.filter((_, i) => i !== index)
                                                        );
                                                        toast.success("Service removed");
                                                    }}
                                                    className="text-red-600 hover:text-red-800 font-semibold"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* SUMMARY */}
                            <div className="mt-4 p-4 bg-gray-50 rounded">
                                <div className="flex justify-between mb-2">
                                    <span>Total Services: {data.length}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-red-600">
                                    <span>Grand Total:</span>
                                    <span>
                                        ₹
                                        {data
                                            .reduce((sum, service) => sum + parseFloat(service.total || 0), 0)
                                            .toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-6">
                            No services added yet. Select services from above.
                        </div>
                    )}
                </Card>

                {/* ================= ROW 5 ================= */}
                {/* BOOKING SUMMARY & DISCOUNT */}
                <Card title="5. Booking Summary & Create">
                    <div className="grid grid-cols-2 gap-8">
                        {/* LEFT: DISCOUNT & COUPON */}
                        <div>
                            <label className="text-xs font-medium block mb-2">Discount Amount (₹)</label>
                            <input
                                type="number"
                                value={manualDiscount}
                                onChange={(e) => setManualDiscount(Number(e.target.value))}
                                className="w-full border rounded px-3 py-2 text-sm mb-4"
                                placeholder="Enter discount amount"
                            />

                            <label className="text-xs font-medium block mb-2">Coupon Code</label>
                            <Select
                                placeholder="Select coupon"
                                value={coupon}
                                onChange={setCoupon}
                                className="w-full"
                                isClearable
                            />
                        </div>

                        {/* RIGHT: SUMMARY */}
                        <div>
                            {(() => {
                                const subtotal = data && Array.isArray(data) && data.length > 0
                                    ? data.reduce((sum, service) => sum + parseFloat(service.total || 0), 0)
                                    : 0;
                                const afterDiscount = subtotal - manualDiscount;
                                const gst = afterDiscount * 0.18; // 18% GST
                                const finalTotal = afterDiscount + gst;

                                return (
                                    <div className="bg-gray-50 p-4 rounded border border-gray-200">
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-700">Subtotal:</span>
                                                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                                            </div>

                                            {manualDiscount > 0 && (
                                                <div className="flex justify-between text-green-600">
                                                    <span>Discount:</span>
                                                    <span className="font-semibold">-₹{manualDiscount.toFixed(2)}</span>
                                                </div>
                                            )}

                                            <div className="border-t pt-3">
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-gray-700">Amount After Discount:</span>
                                                    <span className="font-semibold">₹{afterDiscount.toFixed(2)}</span>
                                                </div>

                                                <div className="flex justify-between text-orange-600">
                                                    <span>GST (18%):</span>
                                                    <span className="font-semibold">+₹{gst.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            <div className="border-t pt-3 flex justify-between text-lg font-bold text-blue-600">
                                                <span>Total Amount:</span>
                                                <span>₹{finalTotal.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    {/* BUTTON */}
                    <div className="mt-6 flex justify-end">
                        {!booking ? (
                            <button
                                onClick={handleCreateBooking}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-semibold"
                            >
                                Create Booking
                            </button>
                        ) : (
                            <span className="text-sm bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                                ✓ Booking Created Successfully
                            </span>
                        )}
                    </div>
                </Card>
            </div>

            {/* ================= MODAL ================= */}
            {showAddService && (
                <AdminAddServiceModal
                    // isOpen={showAddService}
                    // bookingId={booking.id}
                    serviceTypeId={serviceTypeId}
                    roomId={roomId}
                    selectedService={selectedService}
                    onClose={(refresh) => {
                        setShowAddService(false);
                    }}
                    setData={setData}
                />
            )}
        </DashboardLayout>
    );
};
const Card = ({ title, children }) => (
    <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-0">{title}</h3>
        {children}
    </div>
);

Card.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
};
export default CreateBookingPage;
