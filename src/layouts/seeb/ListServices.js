import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { MdModeEdit } from 'react-icons/md';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Toaster, toast } from 'react-hot-toast';
import Toggle from 'react-toggle';
import { apiCall } from 'utils/apiClient';

const ListServices = () => {
    const antIcon = <LoadingOutlined style={{ fontSize: 60 }} spin />;
    const deletstyle = { color: "red" };
    const editstyle = { color: "green" };

    const [serviceData, setServiceData] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [Loader, setLoader] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const getAllServices = async () => {
        setLoader(true);
        try {
            const result = await apiCall({
                endpoint: "services",
                method: 'GET',
            });
            setLoader(false);
            if (result.status === 200) {
                setServiceData(result.data);
                setFilteredServices(result.data);
            }
        } catch (error) {
            setLoader(false);
            console.error('Error fetching Services:', error);
        }
    };

    // Handle search change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value === '') {
            setFilteredServices(serviceData);
        } else {
            const filtered = serviceData.filter(service =>
                service.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredServices(filtered);
        }
    };

    const handleServiceDelete = async (id) => {
        try {
            const result = await apiCall({
                endpoint: `/services/${id}`,
                method: 'DELETE',
            });
            if (result.status === 200) {
                getAllServices();
                toast.success("Services Deleted Successfully");
            }
        } catch (error) {
            console.log('Error deleting work type:', error);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === "1" ? "0" : "1";

        try {
            const result = await apiCall({
                endpoint: `services/change-status/${id}`,
                method: "PUT",
                data: { status: newStatus },
            });

            if (result.status === 200) {
                setFilteredServices(prevData => prevData.map(el =>
                    el.id === id ? { ...el, status: newStatus } : el
                ));
            } else {
                console.error("Error updating status:", result.message);
            }
        } catch (error) {
            console.error("Request failed:", error);
        }
    };


    // Load Services data when the component mounts
    useEffect(() => {
        getAllServices();
    }, []);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" reverseOrder={false} />

            {Loader ? (
                <div className='flex justify-center items-center h-[75vh] w-full'>
                    <Spin indicator={antIcon} />
                </div>
            ) : (
                <div className="border-solid border-2 black-indigo-600 mt-6">
                    <div style={{ fontSize: 15 }} className="px-8 mt-5">
                        Services
                    </div>

                    {/* Search Input */}
                    <div className="flex items-center justify-between px-8 mt-4">
                        <input
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/3 pl-3 p-2.5"
                            placeholder="Search Services"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button
                            onClick={() => navigate('/services/create')}
                            className="px-4 py-2 bg-indigo-500 text-white rounded-lg"
                        >
                            Add New Service
                        </button>
                    </div>

                    {/* Display Services */}
                    <div className="overflow-x-auto relative mt-6 mb-6 mx-4">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="py-3 px-6">Sr No</th>
                                    <th className="py-3 px-6">Name</th>
                                    <th className="py-3 px-6">Service Name</th>
                                    {/* <th className="py-3 px-6">Image</th> */}
                                    <th className="py-3 px-6">Rate</th>
                                    <th className="py-3 px-6">Rate Type</th>
                                    <th className="py-3 px-6">Status</th>
                                    <th className="py-3 px-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredServices?.length > 0 ? (
                                    filteredServices.map((el, index) => (
                                        <tr className="bg-white border-b hover:bg-gray-50" key={el.id}>
                                            <td className="py-4 px-6">{index + 1}</td>
                                            <td className="py-4 px-6">{el.name}</td>
                                            <td className="py-4 px-6">{el.service_name}</td>
                                            {/* <td className="py-4 px-6">
                                                {el.image && (
                                                    <img
                                                        src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + el.image}
                                                        alt={el.name}
                                                        className="w-16 h-16 object-cover rounded-full"
                                                    />
                                                )}
                                            </td> */}
                                            <td className="py-4 px-6">{el.rate}</td>
                                            <td className="py-4 px-6">{el.rate_type}</td>
                                            <td className="py-4 px-6">
                                                <Toggle
                                                    checked={el.status === "1"}
                                                    onChange={() => handleToggleStatus(el.id, el.status)}
                                                    icons={false}
                                                />
                                            </td>

                                            <td className="py-4 px-6 flex items-center">
                                                <MdModeEdit
                                                    size={24}
                                                    style={editstyle}
                                                    onClick={() => navigate('/services/create', { state: { id: el.id } })}
                                                />
                                                <RiDeleteBin6Fill
                                                    size={24}
                                                    className='ml-4'
                                                    style={deletstyle}
                                                    onClick={() => handleServiceDelete(el.id)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-4 text-center">No Services Available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default ListServices;
