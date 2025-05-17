import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { MdModeEdit } from 'react-icons/md';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Toaster, toast } from 'react-hot-toast';
import { FaEye } from 'react-icons/fa';

const ListSubcategories = () => {
    const antIcon = <LoadingOutlined style={{ fontSize: 60 }} spin />;
    const deletstyle = { color: "red" };
    const editstyle = { color: "green" };

    const [subcategoryData, setSubcategoryData] = useState([]);
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
    const [categoryName, setCategoryName] = useState(''); // State for category name
    const [Loader, setLoader] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [subcategoriesPerPage] = useState(5); // Items per page
    const [subcategoryFormData, setSubcategoryFormData] = useState({ title: '' });
    const [editMode, setEditMode] = useState(false);
    const [subcategoryIdToEdit, setSubcategoryIdToEdit] = useState(null);

    const { categoryId } = useParams();  // Get category ID from the URL
    const navigate = useNavigate();

    // Get category name by categoryId
    const getCategoryName = async () => {
        setLoader(true);
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
        };

        await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + `master/categories/${categoryId}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                setLoader(false);
                if (result.data) {
                    setCategoryName(result.data.title); // Set category name
                }
            })
            .catch(error => {
                setLoader(false);
                console.error('Error fetching category name:', error);
            });
    };

    // Get all subcategories for the given category
    const getAllSubcategories = async () => {
        setLoader(true);
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
        };

        await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + `master/categories/${categoryId}/subcategories`, requestOptions)
            .then(response => response.json())
            .then(result => {
                setLoader(false);
                setSubcategoryData(result.data);
                setFilteredSubcategories(result.data);
            })
            .catch(error => {
                setLoader(false);
                console.error('Error fetching subcategories:', error);
            });
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value === '') {
            setFilteredSubcategories(subcategoryData); // Show all subcategories if search is empty
        } else {
            const filtered = subcategoryData.filter(subcategory =>
                subcategory.title.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredSubcategories(filtered);
        }
    };
    // Handle subcategory deletion
    const handleSubcategoryDelete = async (id) => {
        var requestOptions = {
            method: 'DELETE',
            redirect: 'follow',
        };

        await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + `master/subcategories/${id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status === 200) {
                    getAllSubcategories();
                    toast.success("Subcategory Deleted Successfully");
                }
            })
            .catch(error => console.log('Error deleting subcategory:', error));
    };

    // Handle adding/updating subcategory
    const handleSubcategorySubmit = async (e) => {
        e.preventDefault();
        const updatedFormData = {
            ...subcategoryFormData,
            master_category_id: categoryId, // Add the master_category_id to the data
        };
        const url = editMode
            ? `${process.env.REACT_APP_HAPS_MAIN_BASE_URL}master/subcategories/${subcategoryIdToEdit}`
            : process.env.REACT_APP_HAPS_MAIN_BASE_URL + 'master/subcategories';

        const method = editMode ? 'PUT' : 'POST';

        const requestOptions = {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedFormData),
            redirect: 'follow',
        };

        setLoader(true);

        try {
            const response = await fetch(url, requestOptions);
            const result = await response.json();

            if (result.status === editMode ? 200 : 201) {
                getAllSubcategories();
                toast.success(editMode ? "Subcategory Updated Successfully" : "Subcategory Added Successfully");
                resetForm();
            } else {
                toast.error("Failed to submit subcategory. Please try again.");
            }
        } catch (error) {
            console.error('Error submitting subcategory:', error);
            toast.error("Error while processing request.");
        } finally {
            setLoader(false);
        }
    };

    // Reset form after adding/updating subcategory
    const resetForm = () => {
        setSubcategoryFormData({ title: '' });
        setEditMode(false);
        setSubcategoryIdToEdit(null);
    };


    // Handle subcategory edit
    const handleSubcategoryEdit = (subcategory) => {
        setSubcategoryFormData({ title: subcategory.title });
        setSubcategoryIdToEdit(subcategory.id);
        setEditMode(true);
    };

    // Load subcategories when component mounts
    useEffect(() => {
        getCategoryName(); // Fetch category name
        getAllSubcategories(); // Fetch subcategories
    }, [categoryId]);

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
                        <h2 className='m-4 font-semibold'>Category: {categoryName}</h2> {/* Display category name */}
                        {editMode ? 'Edit Subcategory' : 'Add New Subcategory'}
                    </div>

                    {/* Add/Edit Subcategory Form */}
                    <form className="flex items-center" onSubmit={handleSubcategorySubmit}>
                        <div className="relative w-1/2 m-4">
                            <input
                                type="text"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                                placeholder="Subcategory Name"
                                value={subcategoryFormData.title}
                                onChange={(e) => setSubcategoryFormData({ ...subcategoryFormData, title: e.target.value })}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-500 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none"
                        >
                            {editMode ? 'Update Subcategory' : 'Add Subcategory'}
                        </button>
                        {editMode && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="p-2.5 ml-2 text-sm font-medium text-white bg-red-500 rounded-lg border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none"
                            >
                                Cancel
                            </button>
                        )}
                    </form>

                    {/* Search Input */}
                    <form className="flex items-center mt-6">
                        <div className="relative w-1/2 m-4">
                            <input
                                type="text"
                                id="simple-search"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                                placeholder="Search subcategories..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </form>

                    {/* Subcategories List */}
                    <div className="flex flex-col mt-4">
                        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                <div className="overflow-hidden">
                                    <table className="min-w-full text-left text-sm font-light">
                                        <thead className="border-b font-medium">
                                            <tr>
                                                <th scope="col" className="px-6 py-4">Sr.No</th>
                                                <th scope="col" className="px-6 py-4">Subcategory Name</th>
                                                <th scope="col" className="px-6 py-4">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredSubcategories && filteredSubcategories?.map((subcategory, index) => (
                                                <tr className="border-b" key={index}>
                                                    <td className="whitespace-nowrap px-6 py-4">{index + 1}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{subcategory.title}</td>
                                                    <td className="grid grid-cols-8 mt-4">
                                                        <RiDeleteBin6Fill style={deletstyle} onClick={() => handleSubcategoryDelete(subcategory.id)} />
                                                        <MdModeEdit style={editstyle} onClick={() => handleSubcategoryEdit(subcategory)} />
                                                        {/* <FaEye style={{ color: 'blue' }} onClick={() => navigate(`/view-subcategory/${subcategory.id}`)} /> */}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default ListSubcategories;
