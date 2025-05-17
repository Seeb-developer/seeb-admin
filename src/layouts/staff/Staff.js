import React, { useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { AiFillCloseCircle, AiOutlineDelete } from 'react-icons/ai';
import { Toaster, toast } from 'react-hot-toast';

const Staff = () => {


  const navigate = useNavigate()
  const [staffData, setStaffData] = useState({});
  const [FilesToUpload, setFilesToUpload] = useState({})
  const [isLoading, setIsLoading] = useState({
    adhaar_file: false,
    pan_file: false,
    photo: false,
    join_letter: false
  });


  const RedirectToListStaff = () => {
    navigate("/liststaff")
  }

  const handleOnSubmit = (e) => {
    e.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      name: staffData.name,
      email: staffData.email,
      mobile_no: staffData.phone,
      salary: staffData.salary,
      aadhar_no: staffData.aadhaar_no,
      pan_no: staffData.pan_no,
      designation: staffData.designation,
      joining_date: staffData.joining_date,
      aadhar_card: staffData.adhaar_file,
      pan_card: staffData.pan_file,
      photo: staffData.photo,
      join_letter: staffData.join_letter,
      status: "active"
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "staff/create", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log("result", result);
        if (result.status === 201) {
          toast.success("Staff Added Successfully");
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
      setIsLoading({ ...isLoading, ["pan_file"]: true });
      formdata.append("file", FilesToUpload.pan_file);
    } else if (type === 2) {
      setIsLoading({ ...isLoading, ["adhaar_file"]: true });
      formdata.append("file", FilesToUpload.adhaar_file);
    } else if (type === 3) {
      setIsLoading({ ...isLoading, ["photo"]: true });
      formdata.append("file", FilesToUpload.photo);
    } else if (type === 4) {
      setIsLoading({ ...isLoading, ["join_letter"]: true });
      formdata.append("file", FilesToUpload.join_letter);
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
            setStaffData({ ...staffData, ["pan_file"]: result.path });
            setIsLoading({ ...isLoading, ["pan_file"]: false });
            toast.success("File Uploaded Successfully");
          } else if (type === 2) {
            setStaffData({ ...staffData, ["adhaar_file"]: result.path });
            setIsLoading({ ...isLoading, ["adhaar_file"]: false });
            toast.success("File Uploaded Successfully");
          } else if (type === 3) {
            setStaffData({ ...staffData, ["photo"]: result.path });
            setIsLoading({ ...isLoading, ["photo"]: false });
            toast.success("File Uploaded Successfully");
          } else if (type === 4) {
            setStaffData({ ...staffData, ["join_letter"]: result.path });
            setIsLoading({ ...isLoading, ["join_letter"]: false });
            toast.success("File Uploaded Successfully");
          }
        }
      })
      .catch(error => console.log('error', error))
      .finally(() => setIsLoading({
        adhaar_file: false,
        pan_file: false,
        photo: false,
        join_letter: false
      }))
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
      .catch(error => console.log('error', error));
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      {console.log(staffData)}
      <div className="border-solid border-2 black-indigo-600 mt-6">
        <div style={{ fontSize: 15, }} className="px-8 mt-5 font-bold">
          Add Staff
        </div>
        <div className='mt-6'>
          <form className="w-full" onSubmit={handleOnSubmit}>
            <div className="flex ">
              <div className="w-full px-4">
                <label className="text-gray-700 text-xs font-bold mb-2">
                  Full Name
                </label>
                <input required onChange={(e) => setStaffData({ ...staffData, ["name"]: e.target.value })} className="appearance-none block w-full text-sm  text-gray-700 border  rounded px-1.5 py-1.5 leading-tight focus:outline-none " id="grid-full-name" type="text" placeholder="Full Name" />

              </div>
              <div className="w-full px-4">
                <label className="text-gray-700 text-xs font-bold mb-2">
                  Phone No.
                </label>
                <input required onChange={(e) => setStaffData({ ...staffData, ["phone"]: e.target.value })} className="block w-full text-sm  text-gray-700 border border-gray-200 rounded px-1.5 py-1.5 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-phone-no" type="text" placeholder="000-000-0000" />
              </div>
            </div>

            <div className="flex">
              <div className="w-full px-4">
                <label className="text-gray-700 text-xs font-bold mb-2">
                  Email
                </label>
                <input required onChange={(e) => setStaffData({ ...staffData, ["email"]: e.target.value })} className="appearance-none block w-full text-sm  text-gray-700 border border-gray-200 rounded px-1.5 py-1.5  mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-email" type="email" placeholder="Example@gmail.com" />
              </div>
              <div className="w-full px-4">
                <label className="text-gray-700 text-xs font-bold mb-2">
                  Salary
                </label>
                <input required onChange={(e) => setStaffData({ ...staffData, ["salary"]: e.target.value })} className="block w-full text-sm  text-gray-700 border rounded px-1.5 py-1.5 leading-tight " id="grid-aadhar-no" type="text" placeholder="0" />

              </div>
            </div>

            <div className="flex ">
              <div className="w-full px-4">
                <label className="text-gray-700 text-xs font-bold mb-2">
                  Aadhar No.
                </label>
                <input required onChange={(e) => setStaffData({ ...staffData, ["aadhaar_no"]: e.target.value })} className="block w-full text-sm  text-gray-700 border rounded px-1.5 py-1.5 leading-tight " id="grid-aadhar-no" type="text" placeholder="0000-0000-0000" />

              </div>
              <div className="w-full px-4">
                <label className="text-gray-700 text-xs font-bold mb-2">
                  Pan No.
                </label>
                <input required onChange={(e) => setStaffData({ ...staffData, ["pan_no"]: e.target.value })} className="block w-full text-sm  text-gray-700 border border-gray-200 rounded px-1.5 py-1.5 leading-tight focus:bg-white focus:border-gray-500" id="grid-pan-no" type="text" placeholder="pan no" />
              </div>
            </div>
            <div className="flex ">
              <div className="w-full px-4">
                <label className="text-gray-700 text-xs font-bold mb-2">
                  Joining Date
                </label>
                <input type="date" required onChange={(e) => setStaffData({ ...staffData, ["joining_date"]: e.target.value })} className="block w-full text-sm  text-gray-700 border border-gray-200 rounded px-1.5 py-1.5 leading-tight focus:bg-white focus:border-gray-500" id="grid-pan-no" placeholder="Joining Date" />
              </div>
              <div className="w-full px-4">
                <label className="text-gray-700 text-xs font-bold mb-2">
                  Designation
                </label>
                <input type="text" required onChange={(e) => setStaffData({ ...staffData, ["designation"]: e.target.value })} className="block w-full text-sm  text-gray-700 border border-gray-200 rounded px-1.5 py-1.5 leading-tight focus:bg-white focus:border-gray-500" id="grid-pan-no" placeholder="Manager" />
              </div>
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
                {staffData.pan_file ? (
                  <div className="flex items-center space-x-2">
                    <img
                      src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + staffData.pan_file}
                      alt="Uploaded Pan Card"
                      className="w-20 h-20 object-cover border-2 border-gray-300 rounded"
                    />
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => handleRemoveFile(staffData.pan_file, 'pan_file')}
                    >
                      <AiOutlineDelete size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-row">
                    <input
                      required
                      onChange={(e) =>
                        setFilesToUpload({ ...FilesToUpload, pan_file: e.target.files[0] })
                      }
                      className="block w-full text-sm text-gray-700 border border-gray-200 rounded px-1.5 py-1.5 leading-tight focus:bg-white focus:border-gray-500"
                      id="grid-pancard"
                      type="file"
                    />
                    {FilesToUpload.pan_file && (
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="py-1 px-5 bg-black text-white rounded-r-[25px]"
                          onClick={() => HandleUploadFile(1)}
                        >
                          {isLoading.pan_file ? <div className="ml-2">Loading...</div> : 'Upload'}
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
                {staffData.adhaar_file ? (
                  <div className="flex items-center space-x-2">
                    <img
                      src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + staffData.adhaar_file}
                      alt="Uploaded Aadhar Card"
                      className="w-20 h-20 object-cover border-2 border-gray-300 rounded"
                    />
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => handleRemoveFile(staffData.adhaar_file, 'adhaar_file')}
                    >
                      <AiOutlineDelete size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-row">
                    <input
                      required
                      onChange={(e) =>
                        setFilesToUpload({ ...FilesToUpload, adhaar_file: e.target.files[0] })
                      }
                      className="block w-full text-sm text-gray-700 border border-gray-200 rounded px-1.5 py-1.5 leading-tight focus:bg-white focus:border-gray-500"
                      id="grid-adhaar"
                      type="file"
                    />
                    {FilesToUpload.adhaar_file && (
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="py-1 px-5 bg-black text-white rounded-r-[25px]"
                          onClick={() => HandleUploadFile(2)}
                        >
                          {isLoading.adhaar_file ? <div className="ml-2">Loading...</div> : 'Upload'}
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
                {staffData.join_letter ? (
                  <div className="flex items-center space-x-2">
                    <img
                      src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + staffData.join_letter}
                      alt="Uploaded Joining Letter"
                      className="w-20 h-20 object-cover border-2 border-gray-300 rounded"
                    />
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => handleRemoveFile(staffData.join_letter, 'join_letter')}
                    >
                      <AiOutlineDelete size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-row">
                    <input
                      required
                      onChange={(e) =>
                        setFilesToUpload({ ...FilesToUpload, join_letter: e.target.files[0] })
                      }
                      className="block w-full text-sm text-gray-700 border border-gray-200 rounded px-1.5 py-1.5 leading-tight focus:bg-white focus:border-gray-500"
                      id="grid-joinletter"
                      type="file"
                    />
                    {FilesToUpload.join_letter && (
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="py-1 px-5 bg-black text-white rounded-r-[25px]"
                          onClick={() => HandleUploadFile(4)}
                        >
                          {isLoading.join_letter ? <div className="ml-2">Loading...</div> : 'Upload'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="m-3 grid grid-cols-3 text-xs  mt-4">
              <div>
                <button type='button' className=" m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={RedirectToListStaff}>Back</button>
                <button type='submit' className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Staff
