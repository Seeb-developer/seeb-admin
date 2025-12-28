import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Toaster, toast } from "react-hot-toast";
import { apiCall } from "utils/apiClient";

const RoomElementsManagement = () => {
    const [roomElements, setRoomElements] = useState([]);
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchRoomElements();
    }, []);

    const fetchRoomElements = async () => {
        try {
            const result = await apiCall({
                endpoint: "room-elements",
                method: "GET"
            });
            if (result && result.status === 200) {
                setRoomElements(result.data);
            } else {
                toast.error("Failed to load room elements.");
            }
        } catch (error) {
            console.error("Error fetching room elements:", error);
            toast.error("Failed to load room elements.");
        }
    };

    const handleSaveRoomElement = async () => {
        if (!title.trim()) return;
        try {
            const method = editingId ? "PUT" : "POST";
            const endpoint = editingId ? `room-elements/${editingId}` : "room-elements";

            const result = await apiCall({
                endpoint,
                method,
                data: { title, type }
            });

            if (result.status === 200 || result.status === 201) {
                toast.success(result.message);
                fetchRoomElements();
                setTitle("");
                setEditingId(null);
            } else {
                toast.error("Failed to save room element.");
            }
        } catch (error) {
            console.error("Error saving room element:", error);
            toast.error("Error occurred while saving.");
        }
    };

    const handleEdit = (element) => {
        setEditingId(element.id);
        setTitle(element.title);
    };

    const handleCancel = () => {
        setEditingId(null);
        setTitle("");
    };

    const handleDeleteRoomElement = async (id) => {
        if (!window.confirm("Are you sure you want to delete this room element?")) return;
        try {
            const result = await apiCall({
                endpoint: `room-elements/${id}`,
                method: "DELETE"
            });
            if (result && result.status === 200) {
                toast.success(result.message);
                fetchRoomElements();
            } else {
                toast.error("Failed to delete room element.");
            }
        } catch (error) {
            console.error("Error deleting room element:", error);
            toast.error("Error occurred while deleting.");
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" reverseOrder={false} />

            <div className="border-solid border-2 black-indigo-600 mt-6 p-6 rounded-lg shadow-lg bg-white w-full h-screen overflow-hidden">
                <h2 className="text-2xl font-bold mb-4">Manage Room Elements</h2>

                {/* Input for Adding / Editing */}
                <div className="flex flex-wrap gap-4 mb-6 items-end">
                    {/* Title Input */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="block mb-1 text-sm font-medium text-gray-900">Element Title</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded-md"
                            placeholder="e.g., Sofa, Bed, Lamp"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Room Type Select */}
                    <div className="min-w-[200px]">
                        <label className="block mb-1 text-sm font-medium text-gray-900">Room Type</label>
                        <select
                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select Room Type</option>
                            <option value="residential">Residential</option>
                            <option value="commercial">Commercial</option>
                            <option value="retail">Retail</option>
                            <option value="universal">Universal</option>
                        </select>
                    </div>

                    {/* Add/Update Button */}
                    <div>
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded-md w-full"
                            onClick={handleSaveRoomElement}
                        >
                            {editingId ? "Update" : "Add"} Element
                        </button>
                    </div>

                    {/* Cancel Button (if editing) */}
                    {editingId && (
                        <div>
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-md w-full"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {/* Table to Display Room Elements */}
                <div className="overflow-x-auto bg-gray-100 p-4 rounded-lg">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="py-2 px-4">Sr No.</th>
                                <th className="py-2 px-4">Title</th>
                                <th className="py-2 px-4">Type</th>
                                <th className="py-2 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roomElements?.length > 0 ? (
                                roomElements.map((element, index) => (
                                    <tr key={element.id} className="border-b">
                                        <td className="py-2 px-4">{index + 1}</td>
                                        <td className="py-2 px-4">{element.title}</td>
                                        <td className="py-2 px-4">{element.type}</td>
                                        <td className="py-2 px-4 flex gap-2">
                                            <button
                                                className="bg-blue-500 text-white px-3 py-1 rounded"
                                                onClick={() => handleEdit(element)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                                onClick={() => handleDeleteRoomElement(element.id)}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="py-4 px-4 text-center text-gray-500">
                                        No room elements found.
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

export default RoomElementsManagement;
