import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import { apiCall } from "utils/apiClient";

const BASE_URL = process.env.REACT_APP_HAPS_MAIN_BASE_URL;

const EditServiceModal = ({ service, onClose }) => {
    const [value, setValue] = useState(service.value);
    const [addons, setAddons] = useState([]);
    const [saving, setSaving] = useState(false);
    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);

    /* ---------------- INIT ADDONS ---------------- */
    useEffect(() => {
        try {
            setAddons(service.addons ? JSON.parse(service.addons) : []);
        } catch {
            setAddons([]);
        }

        if (
            service.rate_type === "square_feet" &&
            typeof service.value === "string" &&
            service.value.includes("X")
        ) {
            const [w, h] = service.value
                .split("X")
                .map(v => parseFloat(v.trim()) || 0);

            setWidth(w);
            setHeight(h);
        }
    }, [service]);

    /* ---------------- SERVICE AMOUNT CALC ---------------- */
    const calculateServiceAmount = () => {
        const rate = parseFloat(service.rate || 0);

        if (service.rate_type === "square_feet") {
            const area = (width || 0) * (height || 0);
            return (area * rate).toFixed(2);
        }

        return (parseFloat(value || 0) * rate).toFixed(2);
    };


    /* ---------------- SERVICE VALUE CHANGE ---------------- */
    // ✅ Used for: unit, running_feet, running_meter, points
    const handleValueChange = (val) => {
        setValue(val);

        const serviceSize = parseFloat(val || 0);

        const updatedAddons = addons.map(addon => {
            // ❌ square_feet addons are NOT handled here
            return addon;
        });

        setAddons(updatedAddons);
    };


    /* ---------------- TOTALS ---------------- */
    const serviceAmount = Number(
        calculateServiceAmount(service.rate_type, value, service.rate)
    );

    const addonTotal = addons.reduce(
        (sum, a) => sum + Number(a.total || 0),
        0
    );

    const finalTotal = serviceAmount + addonTotal;

    /* ---------------- SAVE ---------------- */
    const handleSave = async () => {
        if (!value) {
            toast.error("Value cannot be empty");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                value, // service value only
                addons: addons.map(a => ({
                    id: a.id,
                    qty: a.qty,
                })),
            };

            const result = await apiCall({
                endpoint: `booking-service/update/${service.id}`,
                method: "PUT",
                data: payload,
            });

            if (result && result.status === 200) {
                toast.success("Service updated successfully");
                onClose(true);
            } else {
                toast.error(result?.message || "Update failed");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    const handleSquareFeetChange = (w, h) => {
        const widthVal = parseFloat(w) || 0;
        const heightVal = parseFloat(h) || 0;

        setWidth(widthVal);
        setHeight(heightVal);

        // 🔹 Store value in backend-friendly format
        const combinedValue = `${widthVal} X ${heightVal}`;
        setValue(combinedValue);

        const area = widthVal * heightVal;

        // 🔁 Update square_feet addons safely
        const updatedAddons = addons.map(addon => {
            if (
                addon.price_type === "square_feet" &&
                Number(addon.qty) > 0
            ) {
                return {
                    ...addon,
                    qty: area,
                    total: (area * addon.price).toFixed(2),
                };
            }
            return addon;
        });

        setAddons(updatedAddons);
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-xl">

                {/* HEADER */}
                <div className="flex justify-between items-center px-4 py-3 border-b">
                    <h3 className="text-base font-semibold">Edit Service</h3>
                    <button
                        onClick={() => onClose(false)}
                        className="text-gray-500 hover:text-gray-800"
                    >
                        ✕
                    </button>
                </div>

                {/* BODY */}
                <div className="p-4 space-y-4">

                    <div>
                        <p className="text-sm font-medium">{service.service_name}</p>
                        <p className="text-xs text-gray-500">
                            Rate Type: {service.rate_type}
                        </p>
                        <p className="text-xs text-gray-500">
                            Price: {service.rate} per {service.rate_type === "square_feet" ? "sq.ft" : "unit"}
                        </p>
                    </div>

                    {/* VALUE */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {service.rate_type === "square_feet"
                                ? "Size (W X H)"
                                : "Quantity / Meter"}
                        </label>

                        {/* VALUE INPUT */}
                        {service.rate_type === "square_feet" ? (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Width (ft)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={width ?? ""}
                                        onChange={(e) => handleSquareFeetChange(e.target.value, height)}
                                        className="w-full border rounded p-2 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Height (ft)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={height ?? ""}
                                        onChange={(e) => handleSquareFeetChange(width, e.target.value)}
                                        className="w-full border rounded p-2 text-sm"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                               
                                <input
                                    value={value}
                                    onChange={(e) => handleValueChange(e.target.value)}
                                    className="w-full border rounded p-2 text-sm"
                                />
                            </div>
                        )}

                    </div>

                    {/* PRICE SUMMARY */}
                    <div className="grid grid-cols-3 gap-3">
                        <PriceBox label="Service Amount" value={serviceAmount} />
                        <PriceBox label="Addon Total" value={addonTotal} />
                        <PriceBox label="Final Total" value={finalTotal} highlight />
                    </div>

                    {/* ADDONS */}
                    {addons.length > 0 && (
                        <div>
                            <h4 className="text-sm font-semibold mb-2">Addons</h4>

                            <div className="border rounded overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 text-xs">
                                        <tr>
                                            <th className="px-3 py-2">Addon</th>
                                            <th className="px-3 py-2">Qty</th>
                                            <th className="px-3 py-2">Price</th>
                                            <th className="px-3 py-2">Total</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {addons.map((addon, index) => {
                                            const isBookedAddon = addon.original_qty !== undefined
                                                ? addon.original_qty > 0
                                                : Number(addon.qty) >= 0;
                                            return (
                                                <tr
                                                    key={index}
                                                    className={`border-t ${!isBookedAddon ? "bg-gray-50 text-gray-400" : ""}`}
                                                >
                                                    <td className="px-3 py-2">
                                                        {addon.name}
                                                        {!isBookedAddon && (
                                                            <span className="ml-2 text-xs italic">(not added)</span>
                                                        )}
                                                    </td>

                                                    <td className="px-3 py-2">
                                                        <td className="px-3 py-2">
                                                            {addon.price_type === "unit" && isBookedAddon ? (
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={addon.qty ?? ""}
                                                                    onChange={(e) => {
                                                                        const qty = e.target.value === ""
                                                                            ? ""
                                                                            : Number(e.target.value);

                                                                        const updated = [...addons];
                                                                        updated[index] = {
                                                                            ...addon,
                                                                            qty,
                                                                            total:
                                                                                qty === "" || qty === 0
                                                                                    ? "0.00"
                                                                                    : (qty * addon.price).toFixed(2),
                                                                        };
                                                                        setAddons(updated);
                                                                    }}
                                                                    className="w-20 border rounded px-2 py-1 text-sm"
                                                                />
                                                            ) : (
                                                                <span>{addon.qty}</span>
                                                            )}
                                                        </td>

                                                    </td>

                                                    <td className="px-3 py-2">₹{addon.price}</td>
                                                    <td className="px-3 py-2 font-medium">₹{addon.total}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <p className="text-xs text-gray-500 mt-2">
                                • Service amount and addon amounts are calculated separately
                                • Addon prices are frozen from booking time
                                • Only quantities can change
                            </p>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-3 px-4 py-3 border-t">
                    <button
                        onClick={() => onClose(false)}
                        className="px-4 py-2 border rounded text-sm"
                        disabled={saving}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-5 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const PriceBox = ({ label, value, highlight }) => (
    <div className={`rounded p-3 text-sm ${highlight ? "bg-green-50" : "bg-gray-50"}`}>
        <p className="text-xs text-gray-500">{label}</p>
        <p className={`font-semibold ${highlight ? "text-green-800" : ""}`}>
            ₹{value.toFixed(2)}
        </p>
    </div>
);

PriceBox.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    highlight: PropTypes.bool,
};

EditServiceModal.propTypes = {
    service: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
};

export default EditServiceModal;
