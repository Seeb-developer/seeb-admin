import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { MdModeEdit } from 'react-icons/md';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Toaster, toast } from 'react-hot-toast';
import { FaEye } from 'react-icons/fa';

const ListMasterCategory = () => {
    const antIcon = <LoadingOutlined style={{ fontSize: 60 }} spin />;
    const deletstyle = { color: "red" };
    const editstyle = { color: "green" };

    const [categoryData, setCategoryData] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [Loader, setLoader] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [categoriesPerPage] = useState(5); // Items per page
    const [categoryFormData, setCategoryFormData] = useState({ title: '' }); // For add/edit form
    const [editMode, setEditMode] = useState(false); // Toggle between Add/Edit
    const [categoryIdToEdit, setCategoryIdToEdit] = useState(null);
    const navigate = useNavigate();

    // Get all categories
    const getAllCategories = async () => {
        setLoader(true);
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
        };

        await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "master/categories", requestOptions)
            .then(response => response.json())
            .then(result => {
                setLoader(false);
                setCategoryData(result.data);
                setFilteredCategories(result.data);
            })
            .catch(error => {
                setLoader(false);
                console.error('Error fetching categories:', error);
            });
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value === '') {
            setFilteredCategories(categoryData); // Show all categories if search is empty
        } else {
            const filtered = categoryData.filter(category =>
                category.title.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredCategories(filtered);
        }
    };


    // Handle category deletion
    const handleCategoryDelete = async (id) => {
        var requestOptions = {
            method: 'DELETE',
            redirect: 'follow',
        };

        await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + `master/categories/${id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status === 200) {
                    getAllCategories();
                    toast.success("Category Deleted Successfully");
                }
            })
            .catch(error => console.log('Error deleting category:', error));
    };

    // Handle adding/updating category
    const handleCategorySubmit = async (e) => {
        e.preventDefault();

        const url = editMode
            ? `${process.env.REACT_APP_HAPS_MAIN_BASE_URL}master/categories/${categoryIdToEdit}`
            : process.env.REACT_APP_HAPS_MAIN_BASE_URL + 'master/categories';

        const method = editMode ? 'PUT' : 'POST';

        const requestOptions = {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryFormData),
            redirect: 'follow',
        };

        setLoader(true); // Set loader to true while submitting the form

        try {
            const response = await fetch(url, requestOptions);
            const result = await response.json();

            if (result.status === editMode ? 200 : 201) {
                getAllCategories(); // Fetch updated categories list
                toast.success(editMode ? "Category Updated Successfully" : "Category Added Successfully");
                resetForm(); // Reset the form after adding/updating category
            } else {
                toast.error("Failed to submit category. Please try again.");
            }
        } catch (error) {
            console.error('Error submitting category:', error);
            toast.error("Error while processing request.");
        } finally {
            setLoader(false); // Set loader to false after submission
        }
    };

    // Reset form after adding/updating category
    const resetForm = () => {
        setCategoryFormData({ title: '' });
        setEditMode(false);
        setCategoryIdToEdit(null);
    };



    // Handle category edit
    const handleCategoryEdit = (category) => {
        setCategoryFormData({ title: category.title });
        setCategoryIdToEdit(category.id);
        setEditMode(true);
    };
    const handleViewSubcategories = (categoryId) => {
        navigate(`/subcategories/${categoryId}`); // Assuming you have a route to manage subcategories
    };

    // Load categories when component mounts
    useEffect(() => {
        getAllCategories();
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
                        {editMode ? 'Edit Category' : 'Add New Category'}
                    </div>

                    {/* Add/Edit Category Form */}
                    <form className="flex items-center" onSubmit={handleCategorySubmit}>
                        <div className="relative w-1/2 m-4">
                            <input
                                type="text"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                                placeholder="Category Name"
                                value={categoryFormData.title}
                                onChange={(e) => setCategoryFormData({ ...categoryFormData, title: e.target.value })}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-500 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none"
                        >
                            {editMode ? 'Update Category' : 'Add Category'}
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
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </form>

                    {/* Categories List */}
                    <div className="flex flex-col mt-4">
                        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                <div className="overflow-hidden">
                                    <table className="min-w-full text-left text-sm font-light">
                                        <thead className="border-b font-medium">
                                            <tr>
                                                <th scope="col" className="px-6 py-4">Sr.No</th>
                                                <th scope="col" className="px-6 py-4">Category Name</th>
                                                <th scope="col" className="px-6 py-4">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCategories && filteredCategories.map((category, index) => (
                                                <tr className="border-b" key={index}>
                                                    <td className="whitespace-nowrap px-6 py-4">{index + 1}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{category.title}</td>
                                                    <td className="grid grid-cols-8 mt-4">
                                                        <RiDeleteBin6Fill style={deletstyle} onClick={() => handleCategoryDelete(category.id)} />
                                                        <MdModeEdit style={editstyle} onClick={() => handleCategoryEdit(category)} />
                                                        <FaEye style={{ color: 'blue' }} onClick={() => handleViewSubcategories(category.id)} /> {/* View icon */}
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

export default ListMasterCategory;
