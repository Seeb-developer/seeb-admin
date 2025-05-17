import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Toaster, toast } from "react-hot-toast";

const FaqsCategory = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}faqs-category`);
            const result = await res.json();
            if (result.status === 200) {
                setCategories(result.data);
            } else {
                toast.error("Failed to fetch FAQ categories");
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return toast.error("Category name is required");

        setLoading(true);

        const method = editingId ? "PUT" : "POST";
        const endpoint = editingId
            ? `faqs-category/update/${editingId}`
            : "faqs-category";

        const res = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${endpoint}`, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });

        const result = await res.json();
        if (result.status === 200 || result.status === 201) {
            toast.success(`Category ${editingId ? "updated" : "added"} successfully`);
            setName("");
            setEditingId(null);
            fetchCategories();
        } else {
            toast.error("Failed to save category");
        }

        setLoading(false);
    };

    const handleEdit = (category) => {
        setName(category.name);
        setEditingId(category.id);
    };

    const handleCancel = () => {
        setName("");
        setEditingId(null);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" />
            <div className="px-10 py-6 bg-white min-h-screen">
                <h2 className="text-xl font-bold mb-4">Manage FAQ Categories</h2>

                <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Enter category name"
                        className="border px-4 py-2 rounded w-64"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded"
                        disabled={loading}
                    >
                        {editingId ? "Update" : "Add"}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            className="text-gray-600 underline text-sm mt-2"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    )}
                </form>

                <div className="border rounded overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-3">Sr No</th>
                                <th className="text-left p-3">Category Name</th>
                                <th className="text-left p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat, i) => (
                                <tr key={cat.id} className="border-t">
                                    <td className="p-3">{i + 1}</td>
                                    <td className="p-3">{cat.name}</td>
                                    <td className="p-3">
                                        <button
                                            className="text-blue-600"
                                            onClick={() => handleEdit(cat)}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center text-gray-500 p-4">
                                        No categories found
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

export default FaqsCategory;
