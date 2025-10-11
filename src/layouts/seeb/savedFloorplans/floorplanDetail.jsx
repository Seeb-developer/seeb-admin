import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = <LoadingOutlined style={{ fontSize: 60 }} spin />;

const SavedFloorPlansDetails = () => {
    const location = useLocation();
    const user = location.state?.user;
    const [userItems, setUserItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserItems = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}floor-plans/user-id/${user.user_id}`);
                const result = await response.json();
                if (result.status === 200) {
                    setUserItems(result.data.reverse());
                }
            } catch (error) {
                console.error("Error fetching user items details:", error);
            }
            setLoading(false);
        };

        fetchUserItems();
    }, [user]);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <div className="p-6">
                {/* Page Title */}
                <h2 className="text-lg font-semibold px-8">User Details for {user?.user_name}</h2>
                    {/* Loader */}
                {loading ? (
                    <div className="flex justify-center items-center h-[75vh] w-full">
                        <Spin indicator={antIcon} />
                    </div>
                ) : (
                    <div className="border-solid border-2 black-indigo-600 mt-6 px-8 pb-6">
                        {/* Table Section */}
                        <div className="overflow-x-auto relative mt-4">
                            {userItems.length > 0 ? (
                                <table className="w-full text-sm text-left text-gray-500 border border-gray-300">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-6 border border-gray-300">Sr.no</th>
                                            <th className="py-3 px-6 border border-gray-300">Room Name</th>
                                            <th className="py-3 px-6 border border-gray-300">Size</th>
                                            <th className="py-3 px-6 border border-gray-300">Floorplan design</th>
                                            <th className="py-3 px-6 border border-gray-300">Created at</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userItems.map((item, index) => (
                                            <tr
                                                key={item.id}
                                                className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                                                onClick={() => navigate("/saved-floorplans-summary", { state: { floorplanId: item.id } })}
                                            >
                                                <td className="py-4 px-6">{index + 1}</td>
                                                <td className="py-4 px-6 border border-gray-300">{item.room_name}</td>
                                                <td className="py-4 px-6 border border-gray-300">{item.room_size} ft</td>
                                                <td className="py-4 px-6 border border-gray-300">
                                                    <img
                                                        src={`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${item.floorplan_image}`}
                                                        alt={item.room_name}
                                                        className="h-28 w-full object-contain rounded"
                                                    />
                                                </td>
                                                <td className="py-4 px-6 border border-gray-300 font-medium">{item.created_at}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center text-gray-500 py-6">No cart items found for this user.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default SavedFloorPlansDetails;
