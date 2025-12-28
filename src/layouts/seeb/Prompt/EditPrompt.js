import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { apiCall } from "utils/apiClient";

const EditPrompt = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const promptId = location.state?.id;

    const [styles, setStyles] = useState([]);
    const [form, setForm] = useState({
        prompt: "",
        description: "",
        style_id: "",
        new_style: "",
        image: null,
        imagePreview: ""
    });

    const fetchStyles = async () => {
        try {
            const result = await apiCall({
                endpoint: "styles",
                method: "GET"
            });
            setStyles(result.data || []);
        } catch {
            toast.error("Failed to fetch styles");
        }
    };

    const fetchPromptDetails = async () => {
        try {
            const result = await apiCall({
                endpoint: `prompts/${promptId}`,
                method: "GET"
            });
            if (result && result.status === 200) {
                const prompt = result.data;
                setForm({
                    prompt: prompt.prompt,
                    style_id: prompt.style_id,
                    new_style: "",
                    image: null,
                    imagePreview: process.env.REACT_APP_HAPS_MAIN_BASE_URL + prompt.image_path
                });
            } else {
                toast.error("Prompt not found");
            }
        } catch {
            toast.error("Error loading prompt");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({
                ...form,
                image: file,
                imagePreview: URL.createObjectURL(file)
            });
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

                if (result && (result.status === 201 || result.status === 200)) {
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

        const formData = new FormData();
        formData.append("prompt", form.prompt);
        formData.append("style_id", finalStyleId);
        if (form.image) {
            formData.append("image", form.image);
        }

        try {
            const result = await apiCall({
                endpoint: `prompts/${promptId}`,
                method: "POST",
                data: formData
            });

            if (result && result.status === 200) {
                toast.success("Prompt updated successfully!");
                navigate("/prompts");
            } else {
                toast.error("Failed to update prompt");
            }
        } catch {
            toast.error("Error submitting form");
        }
    };

    useEffect(() => {
        fetchStyles();
        if (promptId) {
            fetchPromptDetails();
        }
    }, [promptId]);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <div className="px-10 py-6 bg-white min-h-screen">
                <h2 className="text-2xl font-bold mb-6">Edit Prompt</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-2">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
                        <input
                            type="text"
                            name="prompt"
                            value={form.prompt}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter prompt"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Style</label>
                        <select
                            name="style_id"
                            value={form.style_id}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={form.new_style.length > 0}
                        >
                            <option value="">Select a style</option>
                            {styles.map((style) => (
                                <option key={style.id} value={style.id}>
                                    {style.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Or Add New Style</label>
                        <input
                            type="text"
                            name="new_style"
                            value={form.new_style}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="New style name"
                            disabled={form.style_id.length > 0}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <input type="file" onChange={handleImageChange} className="mt-1" />
                        {form.imagePreview && (
                            <img
                                src={form.imagePreview}
                                alt="Preview"
                                className="mt-3 h-40 border rounded shadow"
                            />
                        )}
                    </div>

                    <div className="col-span-2">
                        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
                            Update Prompt
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default EditPrompt;
