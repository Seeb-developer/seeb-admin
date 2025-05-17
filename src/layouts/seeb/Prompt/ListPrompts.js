import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ListPrompts = () => {
    const [prompts, setPrompts] = useState([]);
    const navigate = useNavigate();

    const fetchPrompts = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}prompts`);
            const result = await res.json();
            if (result.status === 200) {
                setPrompts(result.data);
            } else {
                toast.error("Failed to fetch prompts");
            }
        } catch (err) {
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        fetchPrompts();
    }, []);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" />
           <div className="px-10 py-6 bg-white min-h-screen">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Prompt List</h2>
                    <button
                        onClick={() => navigate("/add-prompt")}
                        className="bg-blue-600 text-white px-4 py-1 rounded"
                    >
                        + Add Prompt
                    </button>
                </div>

                <div className="border rounded overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-3">Sr No</th>
                                <th className="text-left p-3">Prompt</th>
                                <th className="text-left p-3">Style</th>
                                <th className="text-left p-3">Image</th>
                                <th className="text-left p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prompts.map((prompt, i) => (
                                <tr key={prompt.id} className="border-t">
                                    <td className="p-3">{i + 1}</td>
                                    <td className="p-3">{prompt.prompt}</td>
                                    <td className="p-3">{prompt.style_name || '-'}</td>
                                    <td className="p-3">
                                        {prompt.image_path ? (
                                            <img
                                                src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + prompt.image_path}
                                                alt="Prompt"
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => navigate("/edit-prompt", { state: { id: prompt.id } })}
                                            className="text-blue-600 text-sm"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {prompts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center p-4 text-gray-500">
                                        No prompts found
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

export default ListPrompts;
