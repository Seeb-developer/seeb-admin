import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { MdModeEdit } from 'react-icons/md';
import { AiFillPrinter } from 'react-icons/ai';
import { LoadingOutlined } from '@ant-design/icons';
import { DatePicker, Spin } from 'antd';
import { Toaster, toast } from 'react-hot-toast';
import jsPDF from "jspdf";
import "jspdf-autotable";
import Pagination from 'components/pagination';

const ListQuotation = () => {

  const location = useLocation();
  const type = location.state?.type || "Interior";

  const antIcon = <LoadingOutlined style={{ fontSize: 60 }} spin />;
  const deletstyle = { color: "red" }
  const editstyle = { color: "green" }

  const [quotaionData, setQuotationData] = useState([]);
  const [Loader, setLoader] = useState(false)
  const [dateRange, setDateRange] = useState([null, null]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [totalPages, setTotalPage] = useState(0)
  const [totalRecords, setTotalRecords] = useState(0)
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const navigate = useNavigate();

  const RedirectToCustomer = () => {

    navigate("/customerquotation", { state: { type } });
  }

  const RedirectToQuotationform = (id) => {

    navigate(`/quotationform/${id}`);
  }


  const getAllQuotations = async (page = 1, perPage = 10, startDate = null, endDate = null, search = '') => {
    try {
      let id = localStorage.getItem("id");

      let raw = JSON.stringify({
        type,
        admin_id: id,
        page,
        per_page: perPage,
        start_date: startDate,
        end_date: endDate,
        search,
      });

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}quotation/getAll`, requestOptions);
      const result = await response.json();

      setQuotationData(result.data);
      setTotalRecords(result.pagination.total_records || 0);
      setTotalPage(result.pagination.total_pages || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  useEffect(() => {
    // setLoader(true)
    getAllQuotations()
  }, [type]);

  const handleConverToSale = async (id, status) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: status }),
      redirect: "follow",
    };

    await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + `quotation/changeStatus/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === 200) {
          toast.success("Quotation convert to sale successfully")
          getAllQuotations()
        }
      })
      .catch((error) => console.error("Error fetching quotation:", error));
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (dates[0] && dates[1]) {
      const startDate = dates[0].toISOString().split('T')[0]; // Format to YYYY-MM-DD
      const endDate = dates[1].toISOString().split('T')[0];
      getAllQuotations(currentPage, recordsPerPage, startDate, endDate);
    }
  };
  const handlePageChange = (number) => {
    getAllQuotations(number, recordsPerPage, dateRange[0], dateRange[1]);
    setCurrentPage(number);
  };

  // Handle records per page changes
  const handleRecordsPerPageChange = (value) => {
    getAllQuotations(1, value, dateRange[0], dateRange[1]);
    setRecordsPerPage(value);
    setCurrentPage(1); // Reset to first page when records per page change
  };

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };
  const handleSearchChange = useCallback(
    debounce((value) => setDebouncedSearch(value), 500),
    []
  );

  useEffect(() => {
    getAllQuotations(1, recordsPerPage, dateRange[0], dateRange[1], debouncedSearch); // Reset to page 1 on search
  }, [debouncedSearch]);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      {Loader ?
        <div className='flex justify-center items-center h-[75vh] w-full'>
          <Spin indicator={antIcon} />
        </div>
        :

        <div className="border-solid border-2 black-indigo-600 mt-6">
          <div style={{ fontSize: 15 }} className="px-8 mt-5">
            List Quotation
          </div>
          <form className="flex items-center">
            <div className="relative w-1/2 m-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              </div>
              <input
                type="text"
                id="simple-search"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search quotation..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearchChange(e.target.value);
                }}
              />
            </div>
            <button type="submit" className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-500 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={RedirectToCustomer}>
              Add New quotation
            </button>
          </form>

          <div className="flex flex-col sm:flex-row items-center justify-between w-full">
            <div className="w-1/2 px-4 py-4">
              <DatePicker.RangePicker
                onChange={handleDateRangeChange}
                format="YYYY-MM-DD"
                className="w-full"
              />
            </div>
            <div className="ml-auto">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                recordsPerPage={recordsPerPage}
                onRecordsPerPageChange={handleRecordsPerPageChange}
                totalRecords={totalRecords}
                count={quotaionData?.length}
              />
            </div>
          </div>


          <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table className="min-w-full text-left text-sm font-light">
                    <thead className="border-b font-medium dark:border-neutral-500">
                      <tr>
                        <th scope="col" className="px-6 py-4">Sr.No</th>
                        <th scope="col" className="px-6 py-4">Name</th>
                        <th scope="col" className="px-6 py-4">Phone</th>
                        <th scope="col" className="px-6 py-4">Address</th>
                        <th scope="col" className="px-6 py-4">Status</th>
                        <th scope="col" className="px-6 py-4">Created by</th>
                        <th scope="col" className="px-6 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotaionData && quotaionData.map((el, i) => {
                        return (
                          <tr className="border-b dark:border-neutral-500" key={i}>
                            <td className="whitespace-nowrap px-6 py-4 font-medium">{i + 1}</td>
                            <td
                              className="whitespace-nowrap px-6 py-4 cursor-pointer text-blue-500 hover:underline"
                              onClick={() => navigate("/quotation-details", { state: { quotation: el, type } })}
                            >
                              {el.customer_name}
                            </td>

                            <td className="whitespace-nowrap px-6 py-4">{el.phone}</td>
                            <td className="whitespace-nowrap px-6 py-4">{el.address}</td>
                            <td className="whitespace-nowrap px-6 py-4">{el.status}</td>
                            <td className="whitespace-nowrap px-6 py-4">{el.created_by_name}</td>
                            <td className="px-6 py-4 text-right flex gap-2">
                              {/* <RiDeleteBin6Fill style={deletstyle} onClick={() => HandleUserDelete(el.id)} /> */}
                              <MdModeEdit style={editstyle} onClick={() => navigate('/customereditquotation', { state: { id: el.id, type } })} />
                              <AiFillPrinter style={{ color: "blueviolet" }} onClick={() => RedirectToQuotationform(el.id)} />
                              {/* <AiFillPrinter style={{ color: "blueviolet" }} onClick={() => handleView(el.id)} /> */}
                              {el.status == 'quotation' &&
                                <button
                                  onClick={() => handleConverToSale(el.id, 'sale')}
                                  className="bg-black text-white px-2 py-1 ml-1 rounded-sm text-xs"
                                >
                                  Convert to Sale
                                </button>
                              }
                              {el.status == 'sale' &&
                                <button
                                  onClick={() => handleConverToSale(el.id, 'handover')}
                                  className="bg-black text-white px-2 py-1 ml-1 rounded-sm text-xs"
                                >
                                  Handover
                                </button>
                              }
                              {el.status == 'quotation' &&
                                <button
                                  onClick={() => handleConverToSale(el.id, 'cancelled')}
                                  className="bg-black text-white px-2 py-1 ml-1 rounded-sm text-xs"
                                >
                                  Cancel
                                </button>
                              }
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>

        </div>
      }
    </DashboardLayout>
  )
}

export default ListQuotation