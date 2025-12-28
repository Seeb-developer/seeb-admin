import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { toast } from "react-hot-toast";
import PropTypes from "prop-types";
import { apiCall } from "utils/apiClient";
import AdminAddServiceModal from "./modals/AdminAddServiceModal";

const BASE_URL = process.env.REACT_APP_HAPS_MAIN_BASE_URL;

const AddServicePage = () => {
    const { id: bookingId } = useParams();
    const navigate = useNavigate();

    const [serviceTypes, setServiceTypes] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [services, setServices] = useState([]);

    const [serviceTypeId, setServiceTypeId] = useState("");
    const [roomId, setRoomId] = useState("");
    const [selectedService, setSelectedService] = useState(null);

    const [value, setValue] = useState("");
    const [addons, setAddons] = useState([]);

    const [search, setSearch] = useState("");
    const [showAddModal, setShowAddModal] = useState(false)

    /* ---------------- FETCH SERVICE TYPES ---------------- */
    useEffect(() => {
        const fetchServiceTypes = async () => {
            const res = await apiCall({
                endpoint: "services-type",
                method: "GET",
            });
            console.log("Service Types:", res);
            if (res.status === 200) {
                setServiceTypes(res.data || []);
            }
        }
        fetchServiceTypes();
    }, []);

    /* ---------------- FETCH ROOMS ---------------- */
    useEffect(() => {
        if (!serviceTypeId) return;
        const fetchRooms = async () => {
            const res = await apiCall({
                endpoint: `rooms?serviceType=${serviceTypeId}`,
                method: "GET",
            });
            console.log("Rooms:", res);
            if (res.status === 200) {
                setRooms(res.data || []);
            }
        }
        fetchRooms();
    }, [serviceTypeId]);

    /* ---------------- FETCH SERVICES ---------------- */
    useEffect(() => {
        if (!roomId) return;
        fetchSevices()
    }, [roomId, search]);

    const fetchSevices = async () => {
        const res = await apiCall({
            endpoint: `services/service-type/${serviceTypeId}/room/${roomId}`,
            method: "GET"
        })
        console.log("services : ", res)
        if (res.status === 200) {
            setServices(res.data)
        }
    }
    /* ---------------- SELECT SERVICE ---------------- */
    const handleSelectService = (srv) => {
        setSelectedService(srv);
        setAddons(srv.addons || []);
        setValue("");
    };

    /* ---------------- ADD TO BOOKING ---------------- */
    const addServiceToBooking = async () => {
        if (!selectedService || !value) {
            toast.error("Please complete service details");
            return;
        }

        const payload = {
            booking_id: bookingId,
            service_id: selectedService.id,
            room_id: roomId,
            value,
            addons: addons.filter(a => a.qty > 0),
        };

        const result = await apiCall({
            endpoint: "booking-service/add",
            method: "POST",
            data: payload,
        });

        if (result && result.status === 200) {
            toast.success("Service added successfully");
            navigate(-1);
        } else {
            toast.error(result?.message || "Failed to add service");
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />

            <div className="mx-6 mt-6 space-y-6">

                {/* STEP 1 */}
                <Card title="1. Select Service Type">
                    <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
                        {serviceTypes.length > 0 ? (
                            serviceTypes.map((type) => (
                                <div
                                    key={type.id}
                                    onClick={() => setServiceTypeId(type.id)}
                                    className={`cursor-pointer border rounded-lg p-1 flex flex-col items-center text-center transition
          ${serviceTypeId === type.id
                                            ? "border-blue-600 bg-blue-50"
                                            : "hover:border-gray-400 hover:bg-gray-50"
                                        }`}
                                >
                                    {/* IMAGE */}
                                    <img
                                        src={
                                            type.image
                                                ? `${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${type.image}`
                                                : "/placeholder.png"
                                        }
                                        alt={type.name}
                                        className="w-12 h-12 object-cover rounded mb-2"
                                    />

                                    {/* NAME */}
                                    <p className="text-sm font-medium text-gray-800 leading-tight">
                                        {type.name}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-sm text-gray-500 py-6">
                                No service types found
                            </div>
                        )}
                    </div>
                </Card>

                {/* STEP 2 */}
                {serviceTypeId && (
                    <Card title="2. Select Room">
                        <Select
                            value={roomId}
                            onChange={setRoomId}
                            options={rooms}
                        />
                    </Card>
                )}

                {/* STEP 3 */}
                {roomId && (
                    <Card title="3. Select Service">
                        <input
                            placeholder="Search service..."
                            className="border p-2 rounded w-full mb-3"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2 py-6 sm:px-6">
                            {services?.map((service) => {
                                const images = JSON.parse(service.image || "[]");
                                const isSelected = selectedService?.id === service.id;

                                return (
                                    <div
                                        key={service.id}
                                        className={`bg-white rounded-xl shadow relative overflow-hidden cursor-pointer transition
          ${isSelected ? "ring-2 ring-blue-600" : "hover:shadow-lg"}
        `}
                                        onClick={() => {
                                            handleSelectService(service)
                                            setShowAddModal(true)
                                        }}
                                    >
                                        {/* IMAGE */}
                                        <img
                                            src={
                                                images[0]
                                                    ? `${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${images[0]}`
                                                    : "/placeholder.png"
                                            }
                                            alt={service.name}
                                            className="h-56 w-full object-cover"
                                        />

                                        {/* OVERLAY */}
                                        <div className="absolute bottom-0 w-full bg-black/90 text-white p-3">
                                            <h3 className="text-sm font-semibold truncate">
                                                {service.name}
                                            </h3>

                                            <div className="flex items-center justify-between mt-1">
                                                {/* RATE */}
                                                <p className="text-xs text-gray-300">
                                                    ₹{service.rate} /{" "}
                                                    {service.rate_type.replace("_", " ")}
                                                </p>

                                                {/* ACTION */}
                                                {isSelected ? (
                                                    <span className="text-xs font-semibold text-green-400">
                                                        Selected ✓
                                                    </span>
                                                ) : (
                                                    <button
                                                        className="text-xs px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-700"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSelectService(service);
                                                            setShowAddModal(true)
                                                        }}
                                                    >
                                                        Add +
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </Card>
                )}

                {/* STEP 4 */}
                {showAddModal && selectedService && (
                    <AdminAddServiceModal
                        isOpen={true}
                        bookingId={bookingId}
                        selectedService={selectedService}
                        roomId={roomId}
                        onClose={(refresh) => {
                            setShowAddModal(false);
                            // if (refresh) fetchBooking();
                        }}
                    />
                )}

            </div>
        </DashboardLayout>
    );
};

/* ---------------- SMALL COMPONENTS ---------------- */

const Card = ({ title, children }) => (
    <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-3">{title}</h3>
        {children}
    </div>
);

Card.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
};


const Select = ({ value, onChange, options }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded p-2 w-full"
    >
        <option value="">Select</option>
        {options.map(o => (
            <option key={o.id} value={o.id}>
                {o.name}
            </option>
        ))}
    </select>
);
Select.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default AddServicePage;
