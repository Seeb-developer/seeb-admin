import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { apiCall } from "utils/apiClient";

const antIcon = <LoadingOutlined style={{ fontSize: 60 }} spin />;

const FloorplanSummary = () => {
    const location = useLocation();
    const floorplanId = location.state?.floorplanId;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!floorplanId) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await apiCall({ endpoint: `floor-plans/${floorplanId}`, method: "GET" });
                if (result.status === 200) {
                    setData(result.data);
                }
            } catch (error) {
                console.error("Error fetching floorplan summary:", error);
            }
            setLoading(false);
        };
        fetchData();
    }, [floorplanId]);

    // Helper to parse JSON fields safely
    const parseJSON = (str) => {
        try {
            return JSON.parse(str);
        } catch {
            return [];
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <div className="p-6">
                <h2 className="text-lg font-semibold px-8 mb-4">Floorplan Summary</h2>
                {loading ? (
                    <div className="flex justify-center items-center h-[75vh] w-full">
                        <Spin indicator={antIcon} />
                    </div>
                ) : data ? (
                    <div className="border-solid border-2 black-indigo-600 mt-6 px-8 py-6 ">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            <div className="mb-1">
                                <strong>Room Name:</strong> {data.room_name}
                            </div>
                            <div className="mb-1">
                                <strong>Room Size:</strong> {data.room_size} ft
                            </div>
                            <div className="mb-1">
                                <strong>Design Instructions:</strong> {data.name}
                            </div>
                            <div className="mb-1">
                                <strong>Primary Color:</strong> {data.primary_color}
                            </div>
                            <div className="mb-1">
                                <strong>Accent Color:</strong> {data.accent_color || "N/A"}
                            </div>
                            <div className="mb-1">
                                <strong>Style:</strong> {data.style_name}
                            </div>
                            <div className="mb-1">
                                <strong>Created At:</strong> {data.created_at}
                            </div>
                        </div>

                        <div className="mb-4">
                            <strong>Floorplan Image:</strong>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="mb-4">
                                <div>
                                    <img
                                        src={`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${data.floorplan_image}`}
                                        alt="Floorplan"
                                        className="h-48 w-auto object-contain rounded my-2"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <strong>3D Images:</strong>
                                <div className="flex gap-4 flex-wrap">
                                    {parseJSON(data.floor3d_image)?.map((img, idx) => (
                                        <a
                                            key={idx}
                                            href={`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${img.replace(/^\/?public/, "public")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img
                                                src={`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${img.replace(/^\/?public/, "public")}`}
                                                alt={`3D ${idx + 1}`}
                                                className="h-40 w-auto object-contain rounded cursor-pointer hover:scale-105 transition-transform duration-300"
                                            />
                                        </a>
                                    ))}

                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <strong className="mb-4">Elements:</strong>
                            <div>
                                {Object.entries(parseJSON(data.elements_json)).map(([name, urls]) => (
                                    <div key={name} className="mb-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div><strong>{name}</strong></div>
                                        <div className="flex gap-2 flex-wrap">
                                            {urls.map((img, i) => (
                                                <a
                                                    key={i}
                                                    href={`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${img.replace(/^\/?public/, "public")}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <img
                                                        src={`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${img.replace(/^\/?public/, "public")}`}
                                                        alt={name}
                                                        className="h-40 w-auto object-contain rounded cursor-pointer hover:scale-105 transition-transform duration-300"
                                                    />
                                                </a>
                                            ))}

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-6">No summary data found.</div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default FloorplanSummary;