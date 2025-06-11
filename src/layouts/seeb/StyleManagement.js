import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Toaster, toast } from "react-hot-toast";

const API_BASE_URL = process.env.REACT_APP_HAPS_MAIN_BASE_URL + "styles";

const StyleManagement = () => {
    const [styles, setStyles] = useState([]);
    const [styleName, setStyleName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [activeTab, setActiveTab] = useState("style"); // "style" or "category"
    const [categories, setCategories] = useState([]);

    const [catName, setCatName] = useState("");
    const [catStatus, setCatStatus] = useState("active");
    const [catImage, setCatImage] = useState(null);
    const [catImagePreview, setCatImagePreview] = useState(null);
    const [editingCatId, setEditingCatId] = useState(null);

    const [styleStatus, setStyleStatus] = useState("active");
    const [styleImage, setStyleImage] = useState(null);
    const [styleImagePreview, setStyleImagePreview] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");


    useEffect(() => {
        if (activeTab === "style") {
            fetchStyles();
        }
        fetchCategories();
    }, [activeTab]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(CATEGORY_API);
            const res = await response.json();
            if (res.status === 200) {
                setCategories(res.data);
            } else {
                toast.error("Failed to fetch categories.");
            }
        } catch (error) {
            toast.error("Failed to load categories.");
        }
    };


    const fetchStyles = async () => {
        try {
            const response = await fetch(API_BASE_URL);
            const res = await response.json();
            if (res.status === 200) {
                setStyles(res.data);
            } else {
                toast.error("Failed to fetch styles.");
            }
        } catch (error) {
            toast.error("Failed to load styles.");
        }
    };

    const handleSaveStyle = async () => {
        if (!styleName.trim() || !selectedCategoryId || !styleStatus) {
            return toast.error("All fields are required.");
        }

        const formData = new FormData();
        formData.append("name", styleName);
        formData.append("status", styleStatus);
        formData.append("styles_category_id", selectedCategoryId);
        if (styleImage) formData.append("image", styleImage);

        try {
            const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;
            const method = editingId ? "PUT" : "POST"; // use PUT if supported
            const response = await fetch(url, {
                method,
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                toast.success(result.message || "Style saved successfully");
                fetchStyles();
                setStyleName("");
                setEditingId(null);
                setStyleStatus("active");
                setStyleImage(null);
                setStyleImagePreview(null);
                setSelectedCategoryId("");
            } else {
                toast.error(result.message || "Failed to save style.");
            }
        } catch (error) {
            console.error("Error saving style:", error);
            toast.error("Something went wrong while saving.");
        }
    };


    const handleEdit = (style) => {
        setEditingId(style.id);
        setStyleName(style.name);
        setStyleStatus(style.status || "active");
        setSelectedCategoryId(style.style_category_id || "");
        setStyleImage(null); // Reset uploaded file
        setStyleImagePreview(style.image || null); // Preview existing image
    };

    const handleCancel = () => {
        setEditingId(null);
        setStyleName("");
        setStyleStatus("active");
        setStyleImage(null);
        setStyleImagePreview(null);
        setSelectedCategoryId("");
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



    const CATEGORY_API = process.env.REACT_APP_HAPS_MAIN_BASE_URL + "styles/category";

    const handleSaveCategory = async () => {
        if (!catName || !catStatus) return toast.error("All fields required");

        const formData = new FormData();
        formData.append("name", catName);
        formData.append("status", catStatus);
        if (catImage) formData.append("image", catImage);

        try {
            const response = await fetch(
                editingCatId ? `${CATEGORY_API}/update/${editingCatId}` : `${CATEGORY_API}/create`,
                {
                    method: editingCatId ? "PUT" : "POST", // You can use PUT if supported
                    body: formData,
                }
            );

            const result = await response.json();
            if (response.ok) {
                toast.success(result.message || "Saved successfully");
                fetchCategories();
                resetCategoryForm();
            } else {
                toast.error(result.message || "Failed to save");
            }
        } catch (error) {
            toast.error("Error saving category");
        }
    };

    const handleEditCategory = (cat) => {
        setEditingCatId(cat.id);
        setCatName(cat.name);
        setCatStatus(cat.status);
        setCatImagePreview(cat.image);
    };

    const resetCategoryForm = () => {
        setEditingCatId(null);
        setCatName("");
        setCatStatus("active");
        setCatImage(null);
        setCatImagePreview(null);
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Are you sure to delete this category?")) return;
        try {
            const response = await fetch(`${CATEGORY_API}/${id}`, { method: "DELETE" });
            const result = await response.json();
            if (response.ok) {
                toast.success("Deleted successfully");
                fetchCategories();
            } else {
                toast.error("Failed to delete");
            }
        } catch (err) {
            toast.error("Error deleting category");
        }
    };


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" reverseOrder={false} />

            <div className="border-solid border-2 black-indigo-600 mt-6 p-6 rounded-lg shadow-lg bg-white w-full h-screen overflow-hidden">
                <h2 className="text-xl font-bold mb-4">Manage Design Styles</h2>

                {/* Tab Buttons */}
                <div className="flex gap-4 mb-6">
                    <button
                        className={`px-4 py-2 rounded-md text-sm ${activeTab === "style"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-800"
                            }`}
                        onClick={() => setActiveTab("style")}
                    >
                        Style
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md text-sm ${activeTab === "category"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-800"
                            }`}
                        onClick={() => setActiveTab("category")}
                    >
                        Style Category
                    </button>
                </div>

                {/* Style Management Section */}
                {activeTab === "style" && (
                    <>
                        {/* Input for Adding / Editing */}
                        <div className="flex flex-col gap-4 mb-6">
                            {/* First Row: Name, Category, Status */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <input
                                    type="text"
                                    className="border p-2 rounded-md text-sm"
                                    placeholder="Enter style name (e.g., Modern, Western)"
                                    value={styleName}
                                    onChange={(e) => setStyleName(e.target.value)}
                                />

                                <select
                                    className="border p-2 rounded-md text-sm"
                                    value={selectedCategoryId}
                                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                                >
                                    <option value="">Select Style Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>

                                <select
                                    className="border p-2 rounded-md text-sm"
                                    value={styleStatus}
                                    onChange={(e) => setStyleStatus(e.target.value)}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                <input
                                    type="file"
                                    className="border p-2 rounded-md text-sm"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setStyleImage(file);
                                        if (file) setStyleImagePreview(URL.createObjectURL(file));
                                    }}
                                />
                            </div>

                            {/* Second Row: Image Upload and Preview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">

                                {styleImagePreview && (
                                    <img src={styleImagePreview} alt="Style Preview" className="w-24 h-24 object-cover rounded" />
                                )}
                            </div>

                            {/* Button Row */}
                            <div className="flex gap-4">
                                <button className="bg-green-500 text-white px-4 py-2 rounded-md text-sm" onClick={handleSaveStyle}>
                                    {editingId ? "Update" : "Add"} Style
                                </button>
                                {editingId && (
                                    <button className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm" onClick={handleCancel}>
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Table to Display Styles */}
                        <div className="overflow-x-auto bg-gray-100 p-4 rounded-lg">
                            <table className="min-w-full bg-white shadow-md rounded-lg">
                                <thead>
                                    <tr className="bg-gray-200 text-left">
                                        <th className="py-2 px-4 text-sm">#</th>
                                        <th className="py-2 px-4 text-sm">Name</th>
                                        <th className="py-2 px-4 text-sm">Image</th>
                                        <th className="py-2 px-4 text-sm">Category</th>
                                        <th className="py-2 px-4 text-sm">Status</th>
                                        <th className="py-2 px-4 text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {styles.length > 0 ? (
                                        styles.map((style, index) => {
                                            const category = categories.find(cat => cat.id === style.style_category_id);
                                            return (
                                                <tr key={style.id} className="border-b">
                                                    <td className="py-2 px-4 text-sm">{index + 1}</td>
                                                    <td className="py-2 px-4 text-sm">{style.name}</td>
                                                    <td className="py-2 px-4">
                                                        <img src={`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${style.image}`} alt={style.name} className="w-12 h-12 object-cover rounded" />
                                                    </td>
                                                    <td className="py-2 px-4 text-sm">{category?.name || '—'}</td>
                                                    <td className="py-2 px-4">
                                                        <span className={`px-2 py-1 rounded text-white ${style.status === "active" ? "bg-green-500" : "bg-red-500"}`}>
                                                            {style.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-2 px-4 flex gap-2">
                                                        <button
                                                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                                                            onClick={() => handleEdit(style)}
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                        <button
                                                            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                                                            onClick={() => handleDeleteStyle(style.id)}
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-4 px-4 text-center text-gray-500 text-sm">
                                                No styles found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* Placeholder for Style Category */}
                {activeTab === "category" && (
                    <>
                        {/* Category Form */}
                        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                            <h3 className="text-md font-semibold mb-4">{editingCatId ? "Edit Category" : "Add New Category"}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    placeholder="Category Name"
                                    className="border p-2 rounded w-full text-sm"
                                    value={catName}
                                    onChange={(e) => setCatName(e.target.value)}
                                />
                                <select
                                    className="border p-2 rounded w-full text-sm"
                                    value={catStatus}
                                    onChange={(e) => setCatStatus(e.target.value)}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="border p-2 rounded w-full text-sm"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setCatImage(file);
                                        if (file) setCatImagePreview(URL.createObjectURL(file));
                                    }}
                                />
                            </div>
                            {catImagePreview && (
                                <div className="mt-4">
                                    <img src={catImagePreview} alt="Preview" className="w-32 h-32 object-cover rounded" />
                                </div>
                            )}
                            <div className="mt-4 flex gap-4">
                                <button
                                    onClick={handleSaveCategory}
                                    className="bg-green-600 text-white px-4 py-2 rounded text-sm"
                                >
                                    {editingCatId ? "Update" : "Add"} Category
                                </button>
                                {editingCatId && (
                                    <button
                                        onClick={resetCategoryForm}
                                        className="bg-gray-500 text-white px-4 py-2 rounded text-sm"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Category Table */}
                        <div className="overflow-x-auto bg-gray-100 p-4 rounded-lg">
                            <table className="min-w-full bg-white shadow-md rounded-lg">
                                <thead>
                                    <tr className="bg-gray-200 text-left">
                                        <th className="py-2 px-4 text-sm">#</th>
                                        <th className="py-2 px-4 text-sm">Name</th>
                                        <th className="py-2 px-4 text-sm">Image</th>
                                        <th className="py-2 px-4 text-sm">Status</th>
                                        <th className="py-2 px-4 text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.length > 0 ? (
                                        categories.map((cat, index) => (
                                            <tr key={cat.id} className="border-b">
                                                <td className="py-2 px-4 text-sm">{index + 1}</td>
                                                <td className="py-2 px-4 text-sm">{cat.name}</td>
                                                <td className="py-2 px-4 text-sm">
                                                    <img src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + cat.image} alt={cat.name} className="w-16 h-16 object-cover rounded" />
                                                </td>
                                                <td className="py-2 px-4 text-sm">
                                                    <span className={`px-2 py-1 rounded text-white ${cat.status === "active" ? "bg-green-500" : "bg-red-500"}`}>
                                                        {cat.status}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-4 flex gap-2">
                                                    <button
                                                        onClick={() => handleEditCategory(cat)}
                                                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCategory(cat.id)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center text-gray-500 py-4 text-sm">No categories found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout >
    );
};

export default StyleManagement;
