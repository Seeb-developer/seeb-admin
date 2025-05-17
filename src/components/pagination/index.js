import React from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const Pagination = ({ currentPage, totalPages, onPageChange, recordsPerPage, onRecordsPerPageChange, totalRecords, count }) => {

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            onPageChange(pageNumber);
        }
    };

    const handleRecordsPerPageChange = (e) => {
        onRecordsPerPageChange(parseInt(e.target.value, 10));
       
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center  gap-4 p-4 ">
            {/* Records per page dropdown */}
            <div className="flex items-center">
                <label htmlFor="records-per-page" className="mr-3 text-sm font-medium">
                    Records per page:
                </label>
                <select
                    id="records-per-page"
                    value={recordsPerPage}
                    onChange={handleRecordsPerPageChange}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:ring focus:ring-blue-300"
                >
                    <option value={10}>10</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={250}>250</option>
                    <option value={500}>500</option>
                    <option value={1000}>1000</option>
                </select>
            </div>

            {/* Total records */}
            <div className="text-sm font-medium text-gray-700">
                <span className="font-semibold">{count}/{totalRecords}</span>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center px-4 p-2  bg-blue-500 text-white rounded-md disabled:opacity-50 hover:bg-blue-600"
                >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                </button>
                <div className="text-sm font-semibold text-gray-800">
                    {currentPage} / {totalPages}
                </div>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-4 p-2  bg-blue-500 text-white rounded-md disabled:opacity-50 hover:bg-blue-600"
                >
                    <ChevronRight className="ml-2 h-8 w-8" />
                </button>
            </div>
        </div>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    recordsPerPage: PropTypes.number.isRequired,
    onRecordsPerPageChange: PropTypes.func.isRequired,
    totalRecords: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
};

export default Pagination;
