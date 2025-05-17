
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState, useEffect, useCallback } from "react";
import { DatePicker, Modal, Input, Button } from "antd";
import Loader from "layouts/loader/Loader";
import NontAuthorized401 from "NontAuthorized401";
import Pagination from "components/pagination";
import AddLeadForm from "./component/AddLeadForm";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";


function InteriorLeads() {
  let navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [totalPages, setTotalPage] = useState(0)
  const [totalRecords, setTotalRecords] = useState(0)

  const [modalVisible, setModalVisible] = useState(false);
  const [fullMessage, setFullMessage] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [remarkModalVisible, setRemarkModalVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [newRemark, setNewRemark] = useState("");
  const handleViewClick = (message) => {
    setFullMessage(message);
    setModalVisible(true);
  };

  const [lead, setLead] = useState([]);
  const [loading, setLoading] = useState(true);


  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };


  const exportToExcel = () => {
    const table = document.getElementById("table-to-export");
    const rows = table.getElementsByTagName("tr");
    let csvContent = "data:text/csv;charset=utf-8,";

    for (const row of rows) {
      const rowData = [];
      const cols = row.getElementsByTagName("td");

      for (const col of cols) {
        rowData.push(col.innerText);
      }

      csvContent += rowData.join(",") + "\n";
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "table.csv");
    document.body.appendChild(link);
    link.click();
  };


  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange(dates);

      if (dates[0] && dates[1]) {
        const startDate = dates[0].toISOString().split('T')[0]; // Format to YYYY-MM-DD
        const endDate = dates[1].toISOString().split('T')[0];   // Format to YYYY-MM-DD

        // Call API with updated date range and pagination
        listLeads(currentPage, recordsPerPage, startDate, endDate);
      }
    } else {
      listLeads(currentPage, recordsPerPage, null, null);
    }
  };
  const handlePageChange = (number) => {
    listLeads(number, recordsPerPage, dateRange[0], dateRange[1]);
    setCurrentPage(number);

    // Call API with updated page number and date range
  };


  // Handle records per page changes
  const handleRecordsPerPageChange = (value) => {
    listLeads(1, value, dateRange[0], dateRange[1]);
    setRecordsPerPage(value);
    setCurrentPage(1); // Reset to first page when records per page change

    // Call API with updated records per page and date range
  };

  const listLeads = async (page = 1, limit = recordsPerPage, startDate = dateRange[0], endDate = dateRange[1], query = debouncedSearch) => {
    // setLoading(true);

    // Format dates to YYYY-MM-DD (if available)
    const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : null;
    const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : null;

    const requestBody = JSON.stringify({
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      page,
      limit,
      search: query,
    });

    const requestOptions = {
      method: "POST", // Changed from GET to POST
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        process.env.REACT_APP_HAPS_MAIN_BASE_URL + "interior/getAllContactUs",
        requestOptions
      );
      const result = await response.json();
      console.log(result);

      if (result.status === 200) {
        setLead(result.data);
        setCurrentPage(result.pagination.current_page);
        setTotalRecords(result.pagination.total_records);
        setTotalPage(result.pagination.total_pages);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching leads:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    listLeads();
  }, []);

  const handleSearchChange = useCallback(
    debounce((value) => setDebouncedSearch(value), 500),
    []
  );

  // Effect to trigger API when search changes
  useEffect(() => {
    listLeads(1, recordsPerPage, dateRange[0], dateRange[1], debouncedSearch); // Reset to page 1 on search
  }, [debouncedSearch]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        contact_number: formData.phone,
        email_id: formData.email,
        message: formData.message,
        status: 1
      }),
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_HAPS_MAIN_BASE_URL}interior/contactUs`,
        requestOptions
      );
      const result = await response.json();

      if (result.status === 200) {
        toast.success("Lead added successfully!");
        listLeads()
        setFormData({ name: "", phone: "", email: "", message: "" });
      } else {
        alert("Failed to add lead.");
      }
    } catch (error) {
      console.error("Error adding lead:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemarkClick = (lead) => {
    setSelectedLead(lead);
    setRemarkModalVisible(true);
  };

  // Handle adding new remark
  const handleAddRemark = async () => {
    if (!newRemark.trim()) return;

    const existingRemarks = selectedLead.remark ? JSON.parse(selectedLead.remark) : [];

    const updatedRemarks = [
      ...existingRemarks,
      { text: newRemark, timestamp: new Date().toISOString() }, // Store timestamp in ISO format
    ];

    fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}interior/updateRemark/${selectedLead.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ remark: JSON.stringify(updatedRemarks) }), // Send updated remarks array
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          toast.success('Remark Added sucessfully')
          setSelectedLead((prev) => ({ ...prev, remark: JSON.stringify(updatedRemarks) }));
          setNewRemark("");
          listLeads()
        } else {
          alert("Failed to add remark.");
        }
      })
      .catch((error) => {
        console.error("Error updating remark:", error);
      });
  };
  const formatToIST = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <>
      {localStorage.getItem("Token") ? (
        <DashboardLayout>
          <DashboardNavbar />
          <Toaster position="top-center" reverseOrder={false} />
          {loading ? (
            <>
              <div className="relative bg-white h-screen overflow-hidden" />
              {loading && (
                <div className="flex justify-center">
                  <div className="absolute top-[30%]">
                    <Loader />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div>
              {/* {console.log(currentPage)} */}
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <AddLeadForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} loading={loading} />
                <div className="flex items-center justify-between gap-4 p-4">
                  {/* Search Input */}
                  <div className="flex-1">
                    <input
                      type="text"
                      id="simple-search"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                      placeholder="Search expenses..."
                      required
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handleSearchChange(e.target.value);
                      }}
                    />
                  </div>

                  {/* Date Picker */}
                  <div className="flex items-center">
                    <DatePicker.RangePicker
                      onChange={handleDateRangeChange}
                      format="YYYY-MM-DD"
                      className="w-full"
                    />
                  </div>

                  {/* Export & Pagination Section */}
                  <div className="flex items-center gap-4">
                    {/* Export Button */}
                    <button
                      onClick={() => exportToExcel()}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold px-4 py-2 rounded"
                    >
                      Export
                    </button>

                  </div>
                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    recordsPerPage={recordsPerPage}
                    onRecordsPerPageChange={handleRecordsPerPageChange}
                    totalRecords={totalRecords}
                    count={lead?.length}
                  />
                </div>


                <div className="flex items-center justify-end flex-end">
                </div>
                <table
                  id="table-to-export"
                  className="w-full text-sm text-left text-gray-500 dark:text-gray-400"
                >
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Sr No
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Phone No.
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Message
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Date / Time
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lead.map((el, index) => (
                      <tr
                        key={el.id}
                        className={`border-b dark:bg-gray-800 dark:border-gray-700 ${index % 2 === 0
                          ? "odd:bg-white even:bg-gray-50"
                          : "odd:dark:bg-gray-800 even:dark:bg-gray-700"
                          }`}
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                        >
                          {/* {(currentPage - 1) * itemsPerPage + index + 1} */}
                          {index + 1}
                        </th>
                        <td className="px-6 py-4">
                          <a>{el.name}</a>
                        </td>
                        <td className="px-6 py-4 ">{el.contact_number}</td>
                        <td className="px-6 py-4 ">{el.email_id}</td>
                        <td
                          className="px-6 py-4"
                          style={{ wordWrap: "break-word", maxWidth: "200px" }}
                        >
                          {el.message.split(" ").slice(0, 10).join(" ")}
                          {el.message.split("").length > 10 && (
                            <button
                              className="text-blue-500 underline ml-2"
                              onClick={() => handleViewClick(el.message)}
                            >
                              View
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4 ">{el.created_at}</td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              navigate('/customerquotation', {
                                state: { customerData: el, type: "Interior" } // Pass the 'el' data here
                              })
                            }
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold text-sm py-2 px-2 rounded-md shadow-sm"
                          >
                            Add Quotation
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemarkClick(el)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm py-2 px-2 rounded-md shadow-sm"
                          >
                            Add/View Remark
                          </button>
                        </td>
                        {modalVisible && (
                          <Modal
                            title="Message"
                            open={modalVisible}
                            onCancel={() => setModalVisible(false)}
                            footer={null}
                            maskStyle={{ backgroundColor: "transparent" }}
                          >
                            <p>{fullMessage}</p>
                          </Modal>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Modal
                  title="Remarks"
                  open={remarkModalVisible}
                  onCancel={() => setRemarkModalVisible(false)}
                  footer={null}
                >
                  <div className="mb-4">
                    <Input.TextArea
                      placeholder="Add a remark..."
                      value={newRemark}
                      onChange={(e) => setNewRemark(e.target.value)}
                      rows={3}
                    />
                    <Button
                      className="mt-2 bg-green-500 hover:bg-green-600 text-white"
                      onClick={handleAddRemark}
                    >
                      Add Remark
                    </Button>
                  </div>

                  <h3 className="text-lg font-semibold mb-2">Previous Remarks:</h3>
                  <div className="max-h-40 overflow-y-auto border p-2 rounded-md">
                    {selectedLead?.remark ? (
                      JSON.parse(selectedLead.remark).length > 0 ? (
                        JSON.parse(selectedLead.remark).map((remark, i) => (
                          <div key={i} className="mb-2 border-b pb-2">
                            <p className="text-gray-700">{remark.text}</p>
                            <p className="text-xs text-gray-500">{formatToIST(remark.timestamp)}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No remarks added yet.</p>
                      )
                    ) : (
                      <p className="text-gray-500">No remarks available.</p>
                    )}
                  </div>
                </Modal>
              </div>

              {/* <div className="flex justify-center mt-4">
        <div className="flex">
          {(currentPage === 1) ? '' : <button
            onClick={() => paginate(currentPage - 1)}
            className={`px-3 mx-3 rounded-md w-[110px] focus:outline-none bg-black text-white text-md ${currentPage === 1 ? 'cursor-not-allowed' : ''}`}
          // disabled={currentPage === 1}
          >
            Previous
          </button>}
          {(currentPage !== pageCount) ? <button
            onClick={() => paginate(currentPage + 1)}
            className={`px-3 mx-3 rounded-md w-[110px] focus:outline-none bg-black text-white text-md ${currentItems.length < itemsPerPage ? 'cursor-allowed' : ''}`}
          // disabled={currentItems.length < itemsPerPage}
          >
            Next
          </button> : ""}

        </div>
      </div> */}
            </div>
          )}
          {/* <Footer /> */}
        </DashboardLayout>
      ) : (
        <NontAuthorized401 />
      )}
    </>
  );
}

export default InteriorLeads;
