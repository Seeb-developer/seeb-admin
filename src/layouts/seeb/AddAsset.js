import { Select, Tag } from "antd";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const AddAsset = () => {
    const [name, setName] = useState("");
    const [details, setDetails] = useState("");
    const [width, setWidth] = useState("");
    const [length, setLength] = useState("");
    const [files, setFiles] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [styles, setStyles] = useState([]);
    const [roomElements, setRoomElements] = useState([]);
    const [selectedRoomElement, setSelectedRoomElement] = useState([]);
    const [selectedStyle, setSelectedStyle] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [existingFile, setExistingFile] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state?.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const roomsRes = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}/rooms`);
                const stylesRes = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}/styles`);
                const roomElementsRes = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}/room-elements`);

                const roomsData = await roomsRes.json();
                const stylesData = await stylesRes.json();
                const roomElementsData = await roomElementsRes.json();

                setRooms(roomsData.data || []);
                setStyles(stylesData.data || []);
                setRoomElements(roomElementsData.data || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load data.");
            }
        };

        fetchData();
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFiles(selectedFile);
        } else {
            setFiles(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setLoading(true);

        try {
            let filePath = existingFile; // Default to existing file

            // If new files selected
            if (files instanceof File) {
                const fileFormData = new FormData();
                fileFormData.append("file", files); // only 1 file now

                const fileUploadResponse = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}/assets/upload`, {
                    method: "POST",
                    body: fileFormData,
                });

                const fileResult = await fileUploadResponse.json();
                if (!fileUploadResponse.ok) {
                    throw new Error(fileResult.message || "File upload failed");
                }

                filePath = fileResult.file;
                // setExistingFile(filePath);
            }

            const assetData = {
                title: name,
                details: details,
                width: width,
                length: length,
                // size: size,
                file: filePath,
                tags: selectedTags,
                room_id: selectedRoom,
                room_element_id: selectedRoomElement,
                style_id: JSON.stringify(selectedStyle),
            };

            const url = id
                ? `${process.env.REACT_APP_HAPS_MAIN_BASE_URL}/assets/${id}`
                : `${process.env.REACT_APP_HAPS_MAIN_BASE_URL}/assets`;

            const method = id ? "PUT" : "POST";

            const assetResponse = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(assetData),
            });

            const assetResult = await assetResponse.json();

            if (assetResponse.ok) {
                toast.success(id ? "Asset updated successfully!" : "Asset added successfully!");
                navigate("/list-asset");
                // Redirect or clear form here
            } else {
                throw new Error(assetResult.message || "Failed to save asset.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message || "An error occurred.");
        }

        setLoading(false);
    };


    useEffect(() => {
        const fetchAsset = async () => {
            if (id) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}/assets/${id}`);
                    const result = await response.json();
                    const asset = result;

                    setName(asset.title);
                    setDetails(asset.details);
                    setWidth(asset.width);
                    setLength(asset.length);
                    setSelectedRoom(asset.room_id);
                    setSelectedTags(asset.tags);
                    setSelectedRoomElement(asset.room_element_id);
                    setSelectedStyle(JSON.parse(asset.style_id));
                    setExistingFile(asset.file || null);
                    // setFiles(asset.file); // or leave this null if not re-uploading

                } catch (error) {
                    console.error("Failed to load asset:", error);
                    toast.error("Failed to load asset details.");
                }
            }
        };

        fetchAsset();
    }, [id]);


    const tagRender = ({ label, closable, onClose }) => {
        const onPreventMouseDown = (event) => {
            event.preventDefault();
            event.stopPropagation();
        };

        return (
            <Tag
                color="blue"
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={onClose}
                style={{ marginInlineEnd: 4 }}
            >
                {label}
            </Tag>
        );
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" reverseOrder={false} />

            <div className="border-solid border-2 black-indigo-600 mt-6 p-6 rounded-lg shadow-lg bg-white w-full h-screen overflow-hidden">
                <h2 className="text-2xl font-bold mb-4">Add New Asset</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold">Asset Title</label>
                            <input
                                type="text"
                                placeholder="Title"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border p-2 rounded w-full text-sm"
                                required
                            />
                        </div>

                        {/* Tags Input */}
                        <div className="flex-1">
                            <label className="block text-sm font-semibold">Tags</label>
                            <input
                                type="text"
                                value={selectedTags}
                                onChange={(e) => setSelectedTags(e.target.value)}
                                className="border p-2 rounded w-full text-sm"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold">Width (in ft)</label>
                            <input
                                type="number"
                                placeholder="Width"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                                className="border p-2 rounded w-full text-sm"
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-semibold">Length (in ft)</label>
                            <input
                                type="number"
                                placeholder="Length"
                                value={length}
                                onChange={(e) => setLength(e.target.value)}
                                className="border p-2 rounded w-full text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {/* Tags Input */}
                        <div className="flex-1">
                            <label className="block text-sm font-semibold">Details (Optional)</label>
                            <textarea
                                placeholder="Description"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                className="border p-2 rounded w-full text-sm"
                                rows="3"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {/* Select Room Elements */}
                        <div className="flex-1">
                            <label className="text-gray-700 text-xs font-bold mb-2">Select Room Element</label>
                            <select
                                value={selectedRoomElement}
                                onChange={(e) => setSelectedRoomElement(e.target.value)}
                                className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                            >
                                <option value="">Select an option</option>
                                {roomElements?.map((element) => (
                                    <option key={element.id} value={element.id}>
                                        {element.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="text-gray-700 text-xs font-bold mb-2">Select Room</label>
                            <select
                                value={selectedRoom}
                                onChange={(e) => setSelectedRoom(e.target.value)}
                                className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                            >
                                <option value="">Select an option</option>
                                {rooms?.map((element) => (
                                    <option key={element.id} value={element.id}>
                                        {element.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>


                    {/* Multi-select for Rooms */}


                    {/* Multi-select for Styles */}
                    <div className="w-full mt-2">
                        <label className="text-gray-700 text-xs font-bold mb-2">
                            Select Style
                        </label>
                        <Select
                            mode="multiple"
                            value={selectedStyle}
                            style={{ width: "100%" }}
                            placeholder="Select styles"
                            onChange={(selectedValues) => {
                                setSelectedStyle(selectedValues);
                            }}
                        >
                            {styles?.map((style) => (
                                <Select.Option key={style.id} value={style.id}>
                                    {style.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold">Upload File</label>
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.gif,.svg,.webp,.pdf,.usdz,.fbx,.obj,.gltf,.glb,.stl,.dae,.zip"
                            onChange={handleFileChange}
                            className="border p-2 rounded w-full text-sm"
                        />

                        {/* Selected file */}
                        {files && (
                            <div className="text-xs text-gray-600 mt-1">
                                Selected: {files.name}
                            </div>
                        )}

                        {/* Existing file */}
                        {existingFile && (
                            <div className="text-xs text-gray-600 mt-1">
                                <a
                                    href={process.env.REACT_APP_HAPS_MAIN_BASE_URL + existingFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    View Existing File
                                </a>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md w-full text-sm"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : id ? "Update Asset" : "Add Asset"}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default AddAsset;
