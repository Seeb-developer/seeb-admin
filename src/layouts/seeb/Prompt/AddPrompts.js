import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { toast, Toaster } from "react-hot-toast";
import { apiCall } from "utils/apiClient";

const AddPrompt = () => {
    const [styles, setStyles] = useState([]);
    const [form, setForm] = useState({
        prompt: "",
        style_id: "",
        new_style: "",
        image: null, // single file
    });


    const fetchStyles = async () => {
        try {
            const result = await apiCall({
                endpoint: "styles",
                method: "GET"
            });
            setStyles(result?.data || []);
        } catch (err) {
            toast.error("Failed to load styles");
        }
    };

    useEffect(() => {
        fetchStyles();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm((prev) => ({ ...prev, image: file }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.prompt || (!form.style_id && !form.new_style)) {
            toast.error("Please fill all required fields");
            return;
        }

        let finalStyleId = form.style_id;

        // 🔁 If new style is entered, create it first
        if (form.new_style) {
            try {
                const result = await apiCall({
                    endpoint: "styles",
                    method: "POST",
                    data: { name: form.new_style }
                });

                if (result.status === 201 || result.status === 200) {
                    finalStyleId = result.data.id;
                    toast.success("New style created successfully");
                    setStyles((prev) => [...prev, result.data]); // Optional: update styles in dropdown
                } else {
                    toast.error("Failed to create new style");
                    return;
                }
            } catch (err) {
                toast.error("Error creating style");
                return;
            }
        }

        // ⬇️ Prepare formData and submit prompt
        const formData = new FormData();
        formData.append("prompt", form.prompt);
        formData.append("style_id", finalStyleId);
        formData.append("image", form.image);


        try {
            const result = await apiCall({
                endpoint: "prompts",
                method: "POST",
                data: formData
            });

            if (result && result.status === 201) {
                toast.success("Prompt added successfully");
                setForm({
                    prompt: "",
                    style_id: "",
                    new_style: "",
                    image: null,
                });
            } else {
                toast.error("Failed to add prompt");
            }
        } catch (err) {
            toast.error("Submission error");
        }
    };


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" />
            <div className="w-full p-8 bg-white shadow-sm rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Prompt</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Prompt Text */}
                    <div className="col-span-1">
                        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
                        <input
                            type="text"
                            name="prompt"
                            id="prompt"
                            placeholder="Enter prompt text"
                            className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={form.prompt}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Style Select */}
                    <div className="col-span-1">
                        <label htmlFor="style_id" className="block text-sm font-medium text-gray-700 mb-1">Select Style</label>
                        <select
                            name="style_id"
                            id="style_id"
                            className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={form.style_id}
                            onChange={handleChange}
                            disabled={form.new_style.length > 0}
                        >
                            <option value="">-- Select a style --</option>
                            {styles.map((style) => (
                                <option key={style.id} value={style.id}>{style.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* New Style */}
                    <div className="col-span-1 md:col-span-2">
                        <label htmlFor="new_style" className="block text-sm font-medium text-gray-700 mb-1">Or Add New Style</label>
                        <input
                            type="text"
                            name="new_style"
                            id="new_style"
                            placeholder="Type new style name"
                            className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={form.new_style}
                            onChange={handleChange}
                            disabled={form.style_id.length > 0}
                        />
                    </div>

                    {/* Description */}
                    {/* <div className="col-span-1 md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            id="description"
                            rows="3"
                            placeholder="Describe the prompt"
                            className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={form.description}
                            onChange={handleChange}
                            required
                        />
                    </div> */}

                    {/* Image Upload */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="w-full text-sm"
                        />
                    </div>

                    {/* Submit */}
                    <div className="col-span-1 md:col-span-2 text-right mt-4">
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium"
                        >
                            Submit
                        </button>
                    </div>
                    {form.image && (
                        <div className="mt-2">
                            <img
                                src={URL.createObjectURL(form.image)}
                                alt="Preview"
                                className="h-40 object-contain rounded border"
                            />
                        </div>
                    )}
                </form>
            </div>

        </DashboardLayout>
    );
};

export default AddPrompt;
