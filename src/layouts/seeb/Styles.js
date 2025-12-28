import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Toaster, toast } from "react-hot-toast";
import { apiCall } from "utils/apiClient";

const Styles = () => {
    const [styles, setStyles] = useState([]);
    const [newStyle, setNewStyle] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");

    const fetchStyles = async () => {
        // try {
        //     const res = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}styles`);
        //     const result = await res.json();
        //     if (result.status === 200) {
        //         setStyles(result.data || []);
        //     } else {
        //         toast.error("Failed to fetch styles");
        //     }
        // } catch {
        //     toast.error("Something went wrong");
        // }
    };

    const addStyle = async (e) => {
        e.preventDefault();
        if (!newStyle.trim()) return toast.error("Style name is required");

        try {
            const result = await apiCall({
                endpoint: "styles",
                method: "POST",
                data: { name: newStyle },
            });

            if (result.status === 201) {
                toast.success("Style added");
                setNewStyle("");
                fetchStyles();
            } else {
                toast.error("Failed to add style");
            }
        } catch (error) {
            toast.error("Failed to add style");
            console.error("Error:", error);
        }
    };

    const updateStyle = async (id) => {
        if (!editingName.trim()) return toast.error("Style name is required");

        try {
            const result = await apiCall({
                endpoint: `styles/update/${id}`,
                method: "PUT",
                data: { name: editingName },
            });

            if (result.status === 200) {
                toast.success("Style updated");
                setEditingId(null);
                fetchStyles();
            } else {
                toast.error("Failed to update style");
            }
        } catch (error) {
            toast.error("Failed to update style");
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchStyles();
    }, []);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" />
            <div className="px-10 py-6 bg-white min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Manage Styles</h2>
                </div>

                <form onSubmit={addStyle} className="flex gap-4 items-center mb-6">
                    <input
                        type="text"
                        className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter new style name"
                        value={newStyle}
                        onChange={(e) => setNewStyle(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm rounded"
                    >
                        Add Style
                    </button>
                </form>

                <div className="border border-gray-200 rounded shadow-sm overflow-x-auto">
                    <table className="min-w-full text-sm text-gray-700">
                        <thead className="bg-gray-50 text-sm text-gray-600">
                            <tr>
                                <th className="text-left px-4 py-3">Sr No</th>
                                <th className="text-left px-4 py-3">Style Name</th>
                                <th className="text-left px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {styles?.map((style, i) => (
                                <tr key={style.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2">{i + 1}</td>
                                    <td className="px-4 py-2">
                                        {editingId === style.id ? (
                                            <input
                                                type="text"
                                                className="border rounded px-2 py-1 text-sm w-full"
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                            />
                                        ) : (
                                            style.name
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {editingId === style.id ? (
                                            <>
                                                <button
                                                    onClick={() => updateStyle(style.id)}
                                                    className="text-green-600 text-sm mr-2"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="text-gray-500 text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setEditingId(style.id);
                                                    setEditingName(style.name);
                                                }}
                                                className="text-blue-600 text-sm"
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {styles.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center p-4 text-gray-400">
                                        No styles found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Styles;
