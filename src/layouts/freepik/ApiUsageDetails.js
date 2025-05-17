import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Toaster } from "react-hot-toast";

const ApiUsageDetails = () => {
    const location = useLocation();
    const apiHistoryId = location.state?.id; // Get ID from previous page

    const [apiDetails, setApiDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (apiHistoryId) {
            fetchApiDetails();
        }
    }, [apiHistoryId]); // Ensure it runs only when apiHistoryId is available

    const fetchApiDetails = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}freepik-api/user/${apiHistoryId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();
            if (result.status === 200 && Array.isArray(result.data)) {
                setApiDetails(result.data);
            } else {
                setApiDetails([]);
            }
        } catch (error) {
            console.error("Error fetching API details:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" reverseOrder={false} />

            <div className="border-solid border-2 black-indigo-600 mt-6 p-6">
                <h2 className="text-lg font-semibold">API Usage Details</h2>

                {loading ? (
                    <p>Loading...</p>
                ) : apiDetails.length > 0 ? (
                    apiDetails.map((detail) => (
                        <div key={detail.id} className="mt-4 border p-4 rounded-md shadow">
                            <p><strong>Prompt:</strong> {detail.prompt}</p>
                            <p><strong>Created At:</strong> {detail.created_at}</p>

                            {/* Show images */}
                            <div className="mt-4">
                                <h3 className="text-md font-semibold">Generated Images:</h3>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    {(() => {
                                        try {
                                            const imagesArray = typeof detail.images === "string" ? JSON.parse(detail.images) : detail.images;
                                            return imagesArray.map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${img}`}
                                                    alt="Generated"
                                                    className="w-32 h-32 object-cover rounded-md shadow"
                                                />
                                            ));
                                        } catch (error) {
                                            console.error("Error parsing images:", error);
                                            return <p>Error loading images</p>;
                                        }
                                    })()}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No data found.</p>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ApiUsageDetails;
