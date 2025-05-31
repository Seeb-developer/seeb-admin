import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import { DatePicker } from "antd";
import { Toaster, toast } from "react-hot-toast";
import Pagination from "components/pagination";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdModeEdit } from "react-icons/md";

const API_BASE_URL = process.env.REACT_APP_HAPS_MAIN_BASE_URL + "assets";

const ListAssets = () => {
    const navigate = useNavigate();

    const [assets, setAssets] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [dateRange, setDateRange] = useState([]);
    const [status, setStatus] = useState(""); // if you want to add custom asset status
    const [filteredAssets, setFilteredAssets] = useState([]);
    const [type, setType] = useState('')
    const [roomElements, setRoomElements] = useState([]);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [selectedRoomElement, setSelectedRoomElement] = useState(null);


    useEffect(() => {
        fetchAssets();
        fetchRoomElements();
    }, []);



    useEffect(() => {
        filterAssets();
    }, [assets, searchQuery, dateRange, status, selectedRoomElement]);

    const fetchAssets = async () => {
        try {
            const response = await fetch(API_BASE_URL);
            const data = await response.json();
            setAssets(data);
        } catch (error) {
            console.error("Error fetching assets:", error);
            toast.error("Failed to load assets.");
        }
    };

    const fetchRoomElements = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "room-elements");
            const res = await response.json();
            setRoomElements(res.data);
        } catch (error) {
            console.error("Error fetching room elements:", error);
            toast.error("Failed to load room elements.");
        }
    };


    const filterAssets = () => {
        let filtered = [...assets];

        if (searchQuery) {
            filtered = filtered.filter((item) => {
                const query = searchQuery.toLowerCase();
                return (
                    item.title?.toLowerCase().includes(query) ||
                    item.room_name?.toLowerCase().includes(query)
                );
            });
        }

        if (dateRange.length === 2) {
            const [start, end] = dateRange;
            filtered = filtered.filter((item) => {
                const itemDate = new Date(item.created_at);
                return itemDate >= new Date(start) && itemDate <= new Date(end);
            });
        }

        if (status) {
            filtered = filtered.filter((item) => item.status === status);
        }

        if (selectedRoomElement) {
            filtered = filtered.filter(
                (item) => item.room_id === selectedRoomElement
            );
        }

        setFilteredAssets(filtered);
    };

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentAssets = filteredAssets.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredAssets.length / recordsPerPage);
    const handleRoomElementSelect = (id) => {
        setSelectedRoomElement((prev) => (prev === id ? null : id));
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this asset?")) {
            // Call your delete API
            fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}/assets/${id}`, {
                method: "DELETE",
            })
                .then((res) => res.json())
                .then((data) => {
                    toast.success("Asset deleted successfully!");
                    // Refresh or refetch assets list here
                    fetchAssets();
                })
                .catch((error) => {
                    console.error("Delete error:", error);
                    toast.error("Failed to delete asset.");
                });
        }
    };


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" reverseOrder={false} />
            <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">List of Assets</h2>

                {/* Filters */}
                <div className="flex items-center justify-between">
                    {/* Search */}
                    <div className="w-1/3 m-4">
                        <input
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            placeholder="Search by Name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Pagination */}
                    <div className="ml-auto">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            recordsPerPage={recordsPerPage}
                            onRecordsPerPageChange={setRecordsPerPage}
                            totalRecords={filteredAssets.length}
                        />
                    </div>
                </div>

                {/* Room Element Filter - Single Select */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {roomElements.map((element) => (
                        <button
                            key={element.id}
                            onClick={() => handleRoomElementSelect(element.id)}
                            className={`px-3 py-1 rounded-md text-sm border ${selectedRoomElement === element.id
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-300"
                                }`}
                        >
                            {element.title}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="overflow-x-auto relative mt-6">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="py-3 px-4">Sr. No</th>
                                <th className="py-3 px-4">Name</th>
                                <th className="py-3 px-4">Tag</th>
                                <th className="py-3 px-4">Room</th>
                                <th className="py-3 px-4">Details</th>
                                <th className="py-3 px-4">Size</th>
                                <th className="py-3 px-4">File</th>
                                <th className="py-3 px-4">Created At</th>
                                <th className="py-3 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentAssets.length > 0 ? (
                                currentAssets.map((asset, index) => (
                                    <tr key={asset.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="py-4 px-4">{indexOfFirstRecord + index + 1}</td>
                                        <td className="py-4 px-4">{asset.title}</td>
                                        <td className="py-4 px-4">{asset.tags}</td>
                                        <td className="py-4 px-4">{asset.room_name}</td>
                                        <td className="py-4 px-4">{asset.details}</td>
                                        <td className="py-4 px-4">{asset.size}</td>
                                        <td className="py-4 px-4">
                                            <a
                                                href={process.env.REACT_APP_HAPS_MAIN_BASE_URL + asset.file}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                View File
                                            </a>
                                        </td>
                                        {/* <td className="py-4 px-4 capitalize">{asset.where_to_use}</td> */}
                                        <td className="py-4 px-4">{asset.created_at}</td>
                                        <td className="py-4 px-4 flex gap-3">
                                            <MdModeEdit
                                                className="text-blue-500 cursor-pointer text-lg"
                                                onClick={() => navigate("/add-asset", { state: { id: asset.id } })}
                                            />
                                            <MdDelete
                                                className="text-red-500 cursor-pointer text-lg"
                                                onClick={() => handleDelete(asset.id)}
                                            />
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-4 text-center">
                                        No assets found.
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

export default ListAssets;
