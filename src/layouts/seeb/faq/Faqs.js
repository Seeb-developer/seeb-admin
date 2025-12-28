import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Toaster, toast } from "react-hot-toast";
import { apiCall } from "utils/apiClient";

const Faqs = () => {
    const [faqs, setFaqs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [form, setForm] = useState({
        id: null,
        category_id: "",
        service_id: "",
        question: "",
        answer: "",
        status: 1,
    });

    const fetchFaqs = async () => {
        const data = await apiCall({
            endpoint: "faqs",
            method: "GET"
        });
        if (data && data.status === 200) setFaqs(data.data);
    };

    const fetchCategories = async () => {
        const data = await apiCall({
            endpoint: "faqs-category",
            method: "GET"
        });
        if (data && data.status === 200) setCategories(data.data);
    };

    const fetchServices = async () => {
        const data = await apiCall({
            endpoint: "services",
            method: "GET"
        });
        if (data && data.status === 200) setServices(data.data);
    };

    useEffect(() => {
        fetchFaqs();
        fetchCategories();
        fetchServices();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const method = form.id ? "PUT" : "POST";
        const endpoint = form.id ? `faqs/${form.id}` : "faqs";

        const result = await apiCall({
            endpoint,
            method,
            data: form
        });

        if (result && (result.status === 200 || result.status === 201)) {
            toast.success(`FAQ ${form.id ? "updated" : "added"} successfully`);
            setForm({ id: null, category_id: "", service_id: "", question: "", answer: "", status: 1 });
            fetchFaqs();
        } else {
            toast.error("Operation failed");
        }
    };

    const handleEdit = (faq) => {
        setForm({
            id: faq.id,
            category_id: faq.category_id || "",
            service_id: faq.service_id || "",
            question: faq.question,
            answer: faq.answer,
        });
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" />
            <div className="px-10 py-6 bg-white min-h-screen">
                <h2 className="text-xl font-bold mb-4">FAQ Management</h2>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 p-6 rounded-lg shadow-sm mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">FAQ Details</h3>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Category</label>
                            <select
                                name="category_id"
                                value={form.category_id}
                                onChange={(e) => setForm({ ...form, category_id: e.target.value, service_id: "" })}
                                className="w-full border p-2 rounded text-sm"
                                disabled={form.service_id !== ""}
                            >
                                <option value="">-- Select Category --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Service</label>
                            <select
                                name="service_id"
                                value={form.service_id}
                                onChange={(e) => setForm({ ...form, service_id: e.target.value, category_id: "" })}
                                className="w-full border p-2 rounded text-sm"
                                disabled={form.category_id !== ""}
                            >
                                <option value="">-- Select Service --</option>
                                {services.map((srv) => (
                                    <option key={srv.id} value={srv.id}>
                                        {srv.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">FAQ Question</label>
                        <input
                            type="text"
                            name="question"
                            value={form.question}
                            onChange={handleChange}
                            placeholder="Enter FAQ Question"
                            className="w-full border p-2 rounded text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">FAQ Answer</label>
                        <textarea
                            name="answer"
                            value={form.answer}
                            onChange={handleChange}
                            placeholder="Enter FAQ Answer"
                            className="w-full border p-2 rounded text-sm"
                            rows="4"
                            required
                        />
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded text-sm transition"
                        >
                            {form.id ? "Update FAQ" : "Add FAQ"}
                        </button>
                    </div>
                </form>


                <div className="border rounded overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-3">Sr No</th>
                                <th className="text-left p-3">Question</th>
                                <th className="text-left p-3">Answer</th>
                                <th className="text-left p-3">Category</th>
                                <th className="text-left p-3">Service</th>
                                <th className="text-left p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faqs.map((faq, i) => (
                                <tr key={faq.id} className="border-t">
                                    <td className="p-3">{i + 1}</td>
                                    <td className="p-3">{faq.question}</td>
                                    <td className="p-3">{faq.answer}</td>
                                    <td className="p-3">{faq.category_name || "-"}</td>
                                    <td className="p-3">{faq.service_name || "-"}</td>
                                    <td className="p-3">
                                        <button onClick={() => handleEdit(faq)} className="text-blue-600 text-sm">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {faqs.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center p-4 text-gray-500">
                                        No FAQs found
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

export default Faqs;
