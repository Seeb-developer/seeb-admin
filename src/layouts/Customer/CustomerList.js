// @mui material components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CustomerListing from "./components/CustomerListing";
import { useEffect, useState } from "react";
import NontAuthorized401 from "NontAuthorized401";
import { DatePicker } from "antd";
import Pagination from "components/pagination"; // ✅ use standard pagination component

function CustomerList() {
  const [customer, setCustomer] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [quickFilter, setQuickFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);

  // Debounce for search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  // API Fetch
  const getAllCustomer = async () => {
    setLoading(true);
    setCustomer([]);
    setPageCount(0);
    setTotalRecords(0);
    try {
      const body = {
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch || undefined,
        startDate: dateRange[0]?.format("YYYY-MM-DD"),
        endDate: dateRange[1]?.format("YYYY-MM-DD"),
        filter: quickFilter || undefined,
      };

      const response = await fetch(
        `${process.env.REACT_APP_HAPS_MAIN_BASE_URL}customer/getCustomer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();

      if (result.status === 200) {
        setCustomer(result.data || []);
        setPageCount(result.pagination.total_pages || 0);
        setTotalRecords(result.pagination.total_records || 0);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCustomer();
  }, [debouncedSearch, dateRange, quickFilter, currentPage, itemsPerPage]);

  // Reset filters
  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setDateRange([]);
    setQuickFilter("");
    setCurrentPage(1);
  };

  return localStorage.getItem("Token") ? (
    <DashboardLayout>
      <DashboardNavbar />

      {/* Outer Bordered Container (matches Booking style) */}
      <div className="border-solid border-2 black-indigo-600 mt-6">
        <div className="px-8 mt-5 text-lg font-semibold">Customer</div>
        <div className="flex flex-col gap-4 px-4 py-4 bg-white rounded-lg shadow mx-6 mt-4">
          {/* Search Input */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="w-full sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Customer..."
                className="w-full border p-2 rounded-lg"
              />
            </div>

            {/* Date Range */}
            <div className="w-full sm:w-72">
              <DatePicker.RangePicker
                value={dateRange}
                onChange={(dates) => setDateRange(dates || [])}
                format="YYYY-MM-DD"
                className="w-full"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2">
              {["today", "this_week", "this_month"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setQuickFilter(filter)}
                  className={`px-3 py-1 text-sm rounded ${quickFilter === filter
                    ? "bg-blue-700 text-white"
                    : "bg-blue-300 text-white hover:bg-blue-600"
                    }`}
                >
                  {filter === "today" && "Today"}
                  {filter === "this_week" && "This Week"}
                  {filter === "this_month" && "This Month"}
                </button>
              ))}
            </div>

            {/* Clear Filters */}
            <div className="w-full sm:w-auto">
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                <span>&#x2715;</span> Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Table Listing */}
        <div className="px-4 pt-6">
          <CustomerListing
            customer={customer}
            loading={loading}
          />
        </div>

        {/* Pagination */}
        <div className="px-6 py-4">
          <Pagination
            currentPage={currentPage}
            totalPages={pageCount}
            onPageChange={(number) => setCurrentPage(number)}
            recordsPerPage={itemsPerPage}
            onRecordsPerPageChange={(value) => {
              setCurrentPage(1);
              setItemsPerPage(value);
            }}
            totalRecords={totalRecords}
            count={customer.length}
          />
        </div>
      </div>
    </DashboardLayout>
  ) : (
    <NontAuthorized401 />
  );
}

export default CustomerList;
