import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { AiFillCloseCircle, AiOutlineDelete } from 'react-icons/ai';
import { Toaster, toast } from 'react-hot-toast';
import PropTypes from 'prop-types';


const InputField = ({ label, type, placeholder, value, onChange, required = false, id }) => (
    <div className="w-full px-4">
        <label className="text-gray-700 text-xs font-bold mb-2">{label}</label>
        <input
            required={required}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="block w-full text-sm text-gray-700 border border-gray-200 rounded px-1.5 py-1.5 leading-tight focus:bg-white focus:border-gray-500"
            id={id}
        />
    </div>
);
InputField.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    id: PropTypes.string.isRequired,
};



const StaffUpdate = () => {
    const location = useLocation();
    const { id } = location.state || {};
    const navigate = useNavigate();
    const [staffData, setStaffData] = useState({});
    const [FilesToUpload, setFilesToUpload] = useState({});
    const [isLoading, setIsLoading] = useState({
        aadhar_card: false,
        pan_card: false,
        photo: false,
        joining_letter: false
    });

    useEffect(() => {
        console.log(location)
        // Fetch existing staff data if staffId is available
        if (id) {
            fetchStaffData(id);
        }
    }, [id]);

    const fetchStaffData = async (id) => {
        const response = await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + `staff/getByID/${id}`);
        const result = await response.json();
        if (result.status === 200) {
            setStaffData(result.data); // Pre-fill form with existing staff data
        } else {
            toast.error("Error fetching staff data");
        }
    };

    const RedirectToListStaff = () => {
        navigate("/liststaff");
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            name: staffData.name,
            email: staffData.email,
            mobile_no: staffData.mobile_no,
            salary: staffData.salary,
            aadhar_no: staffData.aadhar_no,
            pan_no: staffData.pan_no,
            designation: staffData.designation,
            joining_date: staffData.joining_date,
            aadhar_card: staffData.aadhar_card,
            pan_card: staffData.pan_card,
            photo: staffData.photo,
            joining_letter: staffData.joining_letter,
            status: staffData.status,
            relieving_date: staffData.relieving_date
        });

        var requestOptions = {
            method: 'PUT', // Use PUT for updating
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + `staff/updateStaff/${id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status === 200) {
                    toast.success("Staff Updated Successfully");
                    setTimeout(() => {
                        RedirectToListStaff()
                    }, 1000);
                }
            })
            .catch(error => console.log('error', error));
    };

    const HandleUploadFile = async (type) => {
        var formdata = new FormData();
        if (type === 1) {
            setIsLoading({ ...isLoading, ["pan_card"]: true });
            formdata.append("file", FilesToUpload.pan_card);
        } else if (type === 2) {
            setIsLoading({ ...isLoading, ["aadhar_card"]: true });
            formdata.append("file", FilesToUpload.aadhar_card);
        } else if (type === 3) {
            setIsLoading({ ...isLoading, ["photo"]: true });
            formdata.append("file", FilesToUpload.photo);
        } else if (type === 4) {
            setIsLoading({ ...isLoading, ["joining_letter"]: true });
            formdata.append("file", FilesToUpload.joining_letter);
        }

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "staff/FileUpload", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status === 200) {
                    if (type === 1) {
                        setStaffData({ ...staffData, ["pan_card"]: result.path });
                        setIsLoading({ ...isLoading, ["pan_card"]: false });
                        toast.success("File Uploaded Successfully");
                    } else if (type === 2) {
                        setStaffData({ ...staffData, ["aadhar_card"]: result.path });
                        setIsLoading({ ...isLoading, ["aadhar_card"]: false });
                        toast.success("File Uploaded Successfully");
                    } else if (type === 3) {
                        setStaffData({ ...staffData, ["photo"]: result.path });
                        setIsLoading({ ...isLoading, ["photo"]: false });
                        toast.success("File Uploaded Successfully");
                    } else if (type === 4) {
                        setStaffData({ ...staffData, ["joining_letter"]: result.path });
                        setIsLoading({ ...isLoading, ["joining_letter"]: false });
                        toast.success("File Uploaded Successfully");
                    }
                }
            })
            .catch(error => console.log('error', error));
    };

    const handleRemoveFile = async (path, type) => {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            file_path: path,
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "staff/filedelete", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status === 200) {
                    setStaffData((prev) => ({ ...prev, [type]: null }))
                    setFilesToUpload((prev) => ({ ...prev, [type]: null }));
                    toast.success("File deleted successfully")
                }
            })
            .catch(error => console.log('error', error))
            .finally(() => setIsLoading({
                adhaar_file: false,
                pan_file: false,
                photo: false,
                joining_letter: false
            }));
    };


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" reverseOrder={false} />
            <div className="border-solid border-2 black-indigo-600 mt-6">
                <div style={{ fontSize: 15, }} className="px-8 mt-5 font-bold">
                    Update Staff
                </div>
                <div className='mt-6'>
                    <form className="w-full" onSubmit={handleOnSubmit}>
                        <div className="flex">
                            <InputField
                                label="Full Name"
                                type="text"
                                placeholder="Full Name"
                                value={staffData.name}
                                onChange={(e) => setStaffData({ ...staffData, name: e.target.value })}
                                required
                                id="grid-full-name"
                            />
                            <InputField
                                label="Phone No."
                                type="text"
                                placeholder="000-000-0000"
                                value={staffData.mobile_no}
                                onChange={(e) => setStaffData({ ...staffData, mobile_no: e.target.value })}
                                required
                                id="grid-phone-no"
                            />
                        </div>

                        {/* Second Row */}
                        <div className="flex">
                            <InputField
                                label="Email"
                                type="email"
                                placeholder="Example@gmail.com"
                                value={staffData.email}
                                onChange={(e) => setStaffData({ ...staffData, email: e.target.value })}
                                required
                                id="grid-email"
                            />
                            <InputField
                                label="Salary"
                                type="text"
                                placeholder="0"
                                value={staffData.salary}
                                onChange={(e) => setStaffData({ ...staffData, salary: e.target.value })}
                                required
                                id="grid-salary"
                            />
                        </div>

                        {/* Third Row */}
                        <div className="flex">
                            <InputField
                                label="Aadhar No."
                                type="text"
                                placeholder="0000-0000-0000"
                                value={staffData.aadhar_no}
                                onChange={(e) => setStaffData({ ...staffData, aadhar_no: e.target.value })}
                                required
                                id="grid-aadhar-no"
                            />
                            <InputField
                                label="Pan No."
                                type="text"
                                placeholder="PAN No."
                                value={staffData.pan_no}
                                onChange={(e) => setStaffData({ ...staffData, pan_no: e.target.value })}
                                required
                                id="grid-pan-no"
                            />
                        </div>

                        {/* Fourth Row */}

                        <div className="flex">
                            <InputField
                                label="Designation"
                                type="text"
                                placeholder="Manager"
                                value={staffData.designation}
                                onChange={(e) => setStaffData({ ...staffData, designation: e.target.value })}
                                required
                                id="grid-designation"
                            />
                            <div className="w-full px-4">
                                <label className="text-gray-700 text-xs font-bold mb-2">Status</label>
                                <select
                                    required
                                    value={staffData.status}
                                    onChange={(e) => setStaffData({ ...staffData, status: e.target.value })}
                                    className="block w-full text-sm text-gray-700 border border-gray-200 rounded px-1.5 py-1.5 leading-tight focus:bg-white focus:border-gray-500"
                                    id="grid-status"
                                >
                                    <option value="">Select Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>


                        </div>
                        <div className="flex">
                            <InputField
                                label="Joining Date"
                                type="date"
                                value={staffData.joining_date}
                                onChange={(e) => setStaffData({ ...staffData, joining_date: e.target.value })}
                                required
                                id="grid-joining-date"
                            />
                            <InputField
                                label="Relieving Date"
                                type="date"
                                value={staffData.relieving_date}
                                onChange={(e) => setStaffData({ ...staffData, relieving_date: e.target.value })}
                                id="grid-relieving-date"
                            />
                        </div>


                        <div className="flex px-4">
                            <div className="w-full mx-5 mt-5 mb-2">
                                <label className="text-gray-700 text-lg font-bold mb-2">
                                    Document
                                </label>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8 px-4">
                            {/* Pan Card */}
                            <div className="w-full">
                                <label className="text-gray-700 text-xs font-bold mb-2">
                                    Pan Card
                                </label>
                                {staffData.pan_card ? (
                                    <div className="flex items-center space-x-2">
                                        <img
                                            src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + staffData.pan_card}
                                            alt="Uploaded Pan Card"
                                            className="w-20 h-20 object-cover border-2 border-gray-300 rounded"
                                        />
                                        <button
                                            type="button"
                                            className="text-red-500"
                                            onClick={() => handleRemoveFile(staffData.pan_card, 'pan_card')}
                                        >
                                            <AiOutlineDelete size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-row">
                                        <input
                                            required
                                            onChange={(e) =>
                                                setFilesToUpload({ ...FilesToUpload, pan_card: e.target.files[0] })
                                            }
                                            className="block w-full text-sm text-gray-700 border border-gray-200 rounded px-1.5 py-1.5 leading-tight focus:bg-white focus:border-gray-500"
                                            id="grid-pancard"
                                            type="file"
                                        />
                                        {FilesToUpload.pan_card && (
                                            <div className="flex items-center">
                                                <button
                                                    type="button"
                                                    className="py-1 px-5 bg-black text-white rounded-r-[25px]"
                                                    onClick={() => HandleUploadFile(1)}
                                                >
                                                    {isLoading.pan_card ? <div className="ml-2">Loading...</div> : 'Upload'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Aadhar Card */}
                            <div className="w-full">
                                <label className="text-gray-700 text-xs font-bold mb-2">
                                    Aadhar Card
                                </label>
                                {staffData.aadhar_card ? (
                                    <div className="flex items-center space-x-2">
                                        <img
                                            src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + staffData.aadhar_card}
                                            alt="Uploaded Aadhar Card"
                                            className="w-20 h-20 object-cover border-2 border-gray-300 rounded"
                                        />
                                        <button
                                            type="button"
                                            className="text-red-500"
                                            onClick={() => handleRemoveFile(staffData.aadhar_card, 'aadhar_card')}
                                        >
                                            <AiOutlineDelete size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-row">
                                        <input
                                            required
                                            onChange={(e) =>
                                                setFilesToUpload({ ...FilesToUpload, aadhar_card: e.target.files[0] })
                                            }
                                            className="block w-full text-sm text-gray-700 border border-gray-200 rounded px-1.5 py-1.5 leading-tight focus:bg-white focus:border-gray-500"
                                            id="grid-adhaar"
                                            type="file"
                                        />
                                        {FilesToUpload.aadhar_card && (
                                            <div className="flex items-center">
                                                <button
                                                    type="button"
                                                    className="py-1 px-5 bg-black text-white rounded-r-[25px]"
                                                    onClick={() => HandleUploadFile(2)}
                                                >
                                                    {isLoading.aadhar_card ? <div className="ml-2">Loading...</div> : 'Upload'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 px-4">
                            {/* Photo */}
                            <div className="w-full">
                                <label className="text-gray-700 text-xs font-bold mb-2">
                                    Photo
                                </label>
                                {staffData.photo ? (
                                    <div className="flex items-center space-x-2">
                                        <img
                                            src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + staffData.photo}
                                            alt="Uploaded Photo"
                                            className="w-20 h-20 object-cover border-2 border-gray-300 rounded"
                                        />
                                        <button
                                            type="button"
                                            className="text-red-500"
                                            onClick={() => handleRemoveFile(staffData.photo, 'photo')}
                                        >
                                            <AiOutlineDelete size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-row">
                                        <input
                                            required
                                            onChange={(e) => setFilesToUpload({ ...FilesToUpload, photo: e.target.files[0] })}
                                            className="block w-full text-sm text-gray-700 border border-gray-200 rounded px-1.5 py-1.5 leading-tight focus:bg-white focus:border-gray-500"
                                            id="grid-photo"
                                            type="file"
                                        />
                                        {FilesToUpload.photo && (
                                            <div className="flex items-center">
                                                <button
                                                    type="button"
                                                    className="py-1 px-5 bg-black text-white rounded-r-[25px]"
                                                    onClick={() => HandleUploadFile(3)}
                                                >
                                                    {isLoading.photo ? <div className="ml-2">Loading...</div> : 'Upload'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Joining Letter */}
                            <div className="w-full">
                                <label className="text-gray-700 text-xs font-bold mb-2">
                                    Joining Letter
                                </label>
                                {staffData.joining_letter ? (
                                    <div className="flex items-center space-x-2">
                                        <img
                                            src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + staffData.joining_letter}
                                            alt="Uploaded Joining Letter"
                                            className="w-20 h-20 object-cover border-2 border-gray-300 rounded"
                                        />
                                        <button
                                            type="button"
                                            className="text-red-500"
                                            onClick={() => handleRemoveFile(staffData.joining_letter, 'joining_letter')}
                                        >
                                            <AiOutlineDelete size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-row">
                                        <input
                                            required
                                            onChange={(e) =>
                                                setFilesToUpload({ ...FilesToUpload, joining_letter: e.target.files[0] })
                                            }
                                            className="block w-full text-sm text-gray-700 border border-gray-200 rounded px-1.5 py-1.5 leading-tight focus:bg-white focus:border-gray-500"
                                            id="grid-joinletter"
                                            type="file"
                                        />
                                        {FilesToUpload.joining_letter && (
                                            <div className="flex items-center">
                                                <button
                                                    type="button"
                                                    className="py-1 px-5 bg-black text-white rounded-r-[25px]"
                                                    onClick={() => HandleUploadFile(4)}
                                                >
                                                    {isLoading.joining_letter ? <div className="ml-2">Loading...</div> : 'Upload'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="m-3 grid grid-cols-3 text-xs mt-4">
                            <div>
                                <button
                                    type='button'
                                    className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={RedirectToListStaff}
                                >
                                    Back
                                </button>
                                <button
                                    type='submit'
                                    className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StaffUpdate;
