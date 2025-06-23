import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Toaster } from "react-hot-toast";

const ApiUsageDetails = () => {
    const location = useLocation();
    const apiHistoryId = location.state?.id;

    const [apiDetails, setApiDetails] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Toggle options: All, Search, Floorplan
    const [selectedType, setSelectedType] = useState("all");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        if (apiHistoryId) fetchApiDetails();
    }, [apiHistoryId]);

    useEffect(() => {
        filterDataByType();
    }, [apiDetails, selectedType]);

    const fetchApiDetails = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}freepik-api/user-all/${apiHistoryId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
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

    const filterDataByType = () => {
        if (selectedType === "all") {
            setFilteredData(apiDetails);
        } else {
            const filtered = apiDetails.filter(item => item.type === selectedType);
            setFilteredData(filtered);
        }
        setCurrentPage(1); // Reset to page 1 on filter change
    };

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    function getPageNumbers(totalPages, currentPage) {
        const pages = [];

        if (totalPages <= 7) {
            // Show all
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1); // Always show first

            if (currentPage > 4) pages.push("...");

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) pages.push(i);

            if (currentPage < totalPages - 3) pages.push("...");

            pages.push(totalPages); // Always show last
        }

        return pages;
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" reverseOrder={false} />

            <div className="border-solid border-2 black-indigo-600 mt-6 p-6">
                <h2 className="text-lg font-semibold mb-4">API Usage Details</h2>

                {/* Toggle Buttons */}
                <div className="flex gap-4 mb-6">
                    {["all", "search", "floorplan"].map(type => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`px-4 py-2 border rounded ${selectedType === type
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-gray-700 border-gray-300"
                                }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : currentItems.length > 0 ? (
                    currentItems.map((detail) => (
                        <div key={detail.id} className="mt-4 border p-4 rounded-md shadow">
                            <p><strong>Prompt:</strong> {detail.prompt}</p>
                            <p><strong>Type:</strong> {detail.type}</p>
                            <p><strong>Created At:</strong> {detail.created_at}</p>

                            {/* Images */}
                            <div className="mt-4">
                                <h3 className="text-md font-semibold">Generated Images:</h3>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    {(() => {
                                        try {
                                            const imagesArray = typeof detail.images === "string" ? JSON.parse(detail.images) : detail.images;
                                            return imagesArray.map((img, index) => (
                                                <a
                                                    key={index}
                                                    href={`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${img}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <img
                                                        src={`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${img}`}
                                                        alt="Generated"
                                                        className="w-32 h-32 object-cover rounded-md shadow"
                                                    />
                                                </a>
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center gap-2 flex-wrap">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Prev
                        </button>

                        {getPageNumbers(totalPages, currentPage).map((page, i) => (
                            <button
                                key={i}
                                onClick={() => typeof page === "number" && setCurrentPage(page)}
                                className={`px-3 py-1 border rounded ${currentPage === page ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
                                    }`}
                                disabled={page === "..."}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ApiUsageDetails;
