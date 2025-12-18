import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { FaPen } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import Pagination from 'components/pagination';

const ListPartner = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const ApiFetch = async () => {
    const body = {
      page: currentPage,
      limit: recordsPerPage,
      search: debouncedSearch
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}partner/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const result = await response.json();
      if (result.status === 200) {
        setData(result.data || []);
        setTotalRecords(result.pagination?.total_records || 0);
        setTotalPages(result.pagination?.total_pages || 0);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    ApiFetch();
  }, [currentPage, recordsPerPage, debouncedSearch]);

  const RedirectToAddPartner = () => {
    navigate("/add-partner");
  };

  const HandlePartnerDelete = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}partner/delete/${id}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (result.status === true) {
        toast.success("Partner deleted successfully");
        ApiFetch();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return "-";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Toaster position="top-center" reverseOrder={false} />

      <div className="border-solid border-2 black-indigo-600 mt-6 bg-white rounded-lg shadow-sm">
        <div className="text-lg font-semibold px-8 pt-6">List Partner</div>

        {/* Search & Add */}
        <div className="flex flex-wrap items-center justify-between px-8 py-4 gap-4">
          <input
            type="text"
            placeholder="Search Partner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 w-full sm:w-1/2"
          />
          <button
            onClick={RedirectToAddPartner}
            className="p-2.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Add New
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border rounded-md">
            <thead className="border-b bg-gray-100 font-medium text-gray-700">
              <tr>
                <th className="px-4 py-3 text-center">Sr.No</th>
                <th className="px-4 py-3 text-center">Name</th>
                <th className="px-4 py-3 text-center">Mobile</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Document Status</th>
                <th className="px-4 py-3 text-center">Bank Status</th>
                <th className="px-4 py-3 text-center">Work</th>
                <th className="px-4 py-3 text-center">Area</th>
                <th className="px-4 py-3 text-center">Labour Count</th>
                <th className="px-4 py-3 text-center">Age</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-center text-gray-800">
              {data.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{(currentPage - 1) * recordsPerPage + index + 1}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.mobile}</td>

                  {/* Partner Status */}
                  <td className="px-4 py-3">
                    <span className={`capitalize text-xs font-semibold px-2 py-1 rounded-full
              ${item.status === 'active' ? 'bg-green-100 text-green-700'
                        : item.status === 'pending' ? 'bg-yellow-100 text-yellow-800'
                          : item.status === 'blocked' ? 'bg-orange-100 text-orange-700'
                            : item.status === 'terminated' ? 'bg-red-100 text-red-700'
                              : item.status === 'resigned' ? 'bg-blue-100 text-blue-700'
                                : item.status === 'rejected' ? 'bg-gray-200 text-gray-700'
                                  : 'bg-gray-100 text-gray-600'}
            `}>
                      {item.status}
                    </span>
                  </td>

                  {/* Document Verification */}
                  <td className="px-4 py-3">
                    <span className={`capitalize text-xs font-medium px-2 py-1 rounded-full
              ${item.documents_verified === 'verified' ? 'bg-green-100 text-green-700'
                        : item.documents_verified === 'pending' ? 'bg-yellow-100 text-yellow-700'
                          : item.documents_verified === 'rejected' ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-600'}
            `}>
                      {item.documents_verified}
                    </span>
                  </td>

                  {/* Bank Verification */}
                  <td className="px-4 py-3">
                    <span className={`capitalize  text-xs font-medium px-2 py-1 rounded-full 
              ${item.bank_verified === 'verified' ? 'bg-green-100 text-green-700'
                        : item.bank_verified === 'pending' ? 'bg-yellow-100 text-yellow-700'
                          : item.bank_verified === 'rejected' ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-600'}
            `}>
                      {item.bank_verified}
                    </span>
                  </td>

                  <td className="px-4 py-3">{item.profession}</td>
                  <td className="px-4 py-3">{item.service_areas}</td>
                  <td className="px-4 py-3">{item.team_size}</td>
                  <td className="px-4 py-3">{calculateAge(item.dob)}</td>

                  <td className="px-4 py-3">
                    <FaPen
                      className="text-green-600 hover:text-green-800 cursor-pointer mx-auto"
                      size={18}
                      onClick={() => navigate('/partner-details', { state: { id: item.id } })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            recordsPerPage={recordsPerPage}
            onRecordsPerPageChange={(val) => {
              setCurrentPage(1);
              setRecordsPerPage(val);
            }}
            totalRecords={totalRecords}
            count={data.length}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ListPartner;
