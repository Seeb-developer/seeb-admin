import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Toaster, toast } from "react-hot-toast";

const API_BASE_URL = process.env.REACT_APP_HAPS_MAIN_BASE_URL + "styles";

const StyleManagement = () => {
    const [styles, setStyles] = useState([]);
    const [styleName, setStyleName] = useState("");
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchStyles();
    }, []);

    const fetchStyles = async () => {
        try {
            const response = await fetch(API_BASE_URL);
            const res = await response.json();
            setStyles(res.data);
        } catch (error) {
            console.error("Error fetching styles:", error);
            toast.error("Failed to load styles.");
        }
    };

    const handleSaveStyle = async () => {
        if (!styleName.trim()) return;
        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: styleName }),
            });

            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                fetchStyles();
                setStyleName("");
                setEditingId(null);
            } else {
                toast.error("Failed to save style.");
            }
        } catch (error) {
            console.error("Error saving style:", error);
            toast.error("Error occurred while saving.");
        }
    };

    const handleEdit = (style) => {
        setEditingId(style.id);
        setStyleName(style.name);
    };

    const handleCancel = () => {
        setEditingId(null);
        setStyleName("");
    };

    const handleDeleteStyle = async (id) => {
        if (!window.confirm("Are you sure you want to delete this style?")) return;
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                fetchStyles();
            } else {
                toast.error("Failed to delete style.");
            }
        } catch (error) {
            console.error("Error deleting style:", error);
            toast.error("Error occurred while deleting.");
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" reverseOrder={false} />

            <div className="border-solid border-2 black-indigo-600 mt-6 p-6 rounded-lg shadow-lg bg-white w-full h-screen overflow-hidden">
                <h2 className="text-2xl font-bold mb-4">Manage Design Styles</h2>

                {/* Input for Adding / Editing */}
                <div className="flex items-center gap-4 mb-6">
                    <input
                        type="text"
                        className="border p-2 rounded-md flex-1"
                        placeholder="Enter style name (e.g., Modern, Western)"
                        value={styleName}
                        onChange={(e) => setStyleName(e.target.value)}
                    />
                    <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={handleSaveStyle}>
                        {editingId ? "Update" : "Add"} Style
                    </button>
                    {editingId && (
                        <button className="bg-gray-500 text-white px-4 py-2 rounded-md" onClick={handleCancel}>
                            Cancel
                        </button>
                    )}
                </div>

                {/* Table to Display Styles */}
                <div className="overflow-x-auto bg-gray-100 p-4 rounded-lg">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="py-2 px-4">Sr No.</th>
                                <th className="py-2 px-4">Name</th>
                                <th className="py-2 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {styles.length > 0 ? (
                                styles.map((style, index) => (
                                    <tr key={style.id} className="border-b">
                                        <td className="py-2 px-4">{index + 1}</td>
                                        <td className="py-2 px-4">{style.name}</td>
                                        <td className="py-2 px-4 flex gap-2">
                                            <button
                                                className="bg-blue-500 text-white px-3 py-1 rounded"
                                                onClick={() => handleEdit(style)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                                onClick={() => handleDeleteStyle(style.id)}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="py-4 px-4 text-center text-gray-500">
                                        No styles found.
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

export default StyleManagement;
