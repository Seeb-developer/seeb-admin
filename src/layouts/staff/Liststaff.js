import React, { useEffect, useState, } from 'react'
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { FaPen, FaTrash } from 'react-icons/fa'
import { Toaster, toast } from 'react-hot-toast';

const ListStaff = () => {

  const navigate = useNavigate()

  const RedirectToStaff = () => {
    navigate("/addstaff");
  }

  const [data, setData] = useState([
    { isActive: true },
    { isActive: true },
    { isActive: true },
    { isActive: true },


  ]);


  const ApiFetch = async () => {

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "staff/getAllStaffs", requestOptions)
      .then(response => response.json())
      .then(result => {
        setData(result.data)
      })

      .catch(error => console.log('error', error));
  }
  //  }
  useEffect(() => {
    ApiFetch()
  }, [])
  const HandleUserDelete = (id) => {
    var requestOptions = {
      method: 'DELETE',
      redirect: 'follow'
    };

    fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + `Staff/Delete/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.Status === 200) {
          ApiFetch()
          toast.success("Staff Deleted Successfully")
        }
      })
      .catch(error => console.log('error', error));
  }


  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className="border-solid border-2 black-indigo-600 mt-6">
        <div style={{ fontSize: 15 }} className="px-8 mt-5">
          List Staff
        </div>
        <form className="flex items-center">

          <div className="relative w-1/2 m-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">

            </div>
            <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search staff..." required />
          </div>
          <button type="button" className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-500 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={RedirectToStaff}>
            Add New Staff
          </button>
          <button type="button" className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-500 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Back
          </button>
        </form>

        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-6 text-center py-4">Sr.No</th>
                      <th scope="col" className="px-6 text-center py-4">Name</th>
                      <th scope="col" className="px-6 text-center py-4">Email</th>
                      <th scope="col" className="px-6 text-center py-4">Mobile No</th>
                      <th scope="col" className="px-6 text-center py-4">Designation</th>
                      <th scope="col" className="px-6 text-center py-4">Files</th>
                      <th scope="col" className="px-6 text-center py-4 ">Status</th>
                      <th scope="col" className="px-6 text-center py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data && data.map((item, index) => (
                      <tr className="border-b dark:border-neutral-500 " key={item.id}>
                        <td className="text-center whitespace-nowrap px-6 py-4 font-medium"> {index + 1}</td>
                        <td className="text-center whitespace-nowrap px-6 py-4">{item.name}</td>
                        <td className="text-center whitespace-nowrap px-6 py-4">{item.email}</td>
                        <td className="text-center whitespace-nowrap px-6 py-4">{item.mobile_no}</td>
                        <td className="text-center whitespace-nowrap px-6 py-4">{item.designation}</td>
                        <td className="text-center whitespace-nowrap px-6 py-4">
                          <div className="space-x-2 mt-2">
                            {item.pan_card && (
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.open(process.env.REACT_APP_HAPS_MAIN_BASE_URL + item.pan_card, '_blank'); // Opens the image in a new tab
                                }}
                                className="text-blue-500 underline"
                              >
                                Pan Card
                              </a>
                            )}
                            {item.aadhar_card && (
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.open(process.env.REACT_APP_HAPS_MAIN_BASE_URL + item.aadhar_card, '_blank');
                                }}
                                className="text-blue-500 underline"
                              >
                                Aadhar Card
                              </a>
                            )}
                            {item.photo && (
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.open(process.env.REACT_APP_HAPS_MAIN_BASE_URL + item.photo, '_blank');
                                }}
                                className="text-blue-500 underline"
                              >
                                Photo
                              </a>
                            )}
                            {item.joining_letter && (
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.open(process.env.REACT_APP_HAPS_MAIN_BASE_URL + item.joining_letter, '_blank');
                                }}
                                className="text-blue-500 underline"
                              >
                                Joining Letter
                              </a>
                            )}
                          </div>
                        </td>
                        <td className='text-center'>
                          <button type='button' className=" ml-2 text-xs font-medium text-white rounded-md  
                             focus:ring-blue-300 dark:bg-blue-600 px-4 py-1 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            style={{
                              backgroundColor: item.status == 'active' ? 'green' : 'red',
                              color: 'white',
                            }} > {item.status}
                          </button>
                        </td>
                        <td className="flex justify-center items-center gap-5  py-4">
                          <FaPen className='text-green-600 hover:text-green-700' size={20} onClick={() => navigate(`/update-staff`, { state: { id: item.id } })} />
                          {/* <FaTrash className='text-red-600 hover:text-red-700' size={20} onClick={() => HandleUserDelete(item.id)} /> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>


                <div className="mt-3 flex md:flex md:flex-grow flex-row justify-end space-x-1">
                  <nav aria-label="Page navigation example">
                    <ul className="inline-flex -space-x-px text-sm">
                      <li>
                        <a href="#" className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center justify-center px-3 h-8 text-grey-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">5</a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
                      </li>
                    </ul>
                  </nav>
                </div>


              </div>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  )
};

export default ListStaff