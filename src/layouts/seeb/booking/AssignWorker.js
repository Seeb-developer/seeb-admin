import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import {
  TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';


// Dummy workers
const dummyWorkers = [
  {
    id: '1',
    name: 'Amit Verma',
    location: 'Pune',
    assignedWorkInProgress: 2,
    completed: 12,
    rejected: 1,
    assignedLocation: 'Baner',
    teamSize: 3,
    lastTask: '2025-06-29',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    location: 'Pune',
    assignedWorkInProgress: 1,
    completed: 7,
    rejected: 0,
    assignedLocation: 'Kothrud',
    teamSize: 2,
    lastTask: '2025-06-30',
  },
  {
    id: '3',
    name: 'Rohit Mehta',
    location: 'Pimpri',
    assignedWorkInProgress: 0,
    completed: 5,
    rejected: 2,
    assignedLocation: 'Wakad',
    teamSize: 4,
    lastTask: '2025-06-25',
  },
  {
    id: '4',
    name: 'Sneha Patil',
    location: 'Mumbai',
    assignedWorkInProgress: 3,
    completed: 10,
    rejected: 0,
    assignedLocation: 'Andheri',
    teamSize: 5,
    lastTask: '2025-06-28',
  },
  {
    id: '5',
    name: 'Rahul Joshi',
    location: 'Navi Mumbai',
    assignedWorkInProgress: 1,
    completed: 8,
    rejected: 1,
    assignedLocation: 'Vashi',
    teamSize: 2,
    lastTask: '2025-06-27',
  },
  {
    id: '6',
    name: 'Neha Singh',
    location: 'Thane',
    assignedWorkInProgress: 2,
    completed: 9,
    rejected: 0,
    assignedLocation: 'Kalyan',
    teamSize: 3,
    lastTask: '2025-06-26',
  },
  {
    id: '7',
    name: 'Vikram Rao',
    location: 'Bangalore',
    assignedWorkInProgress: 4,
    completed: 15,
    rejected: 2,
    assignedLocation: 'Koramangala',
    teamSize: 6,
    lastTask: '2025-06-30',
  },
  {
    id: '8',
    name: 'Anjali Gupta',
    location: 'Delhi',
    assignedWorkInProgress: 0,
    completed: 3,
    rejected: 1,
    assignedLocation: 'Connaught Place',
    teamSize: 1,
    lastTask: '2025-06-29',
  },
  {
    id: '9',
    name: 'Ravi Kumar',
    location: 'Hyderabad',
    assignedWorkInProgress: 1,
    completed: 4,
    rejected: 0,
    assignedLocation: 'Banjara Hills',
    teamSize: 2,
    lastTask: '2025-06-30',
  },
  {
    id: '10',
    name: 'Pooja Desai',
    location: 'Chennai',
    assignedWorkInProgress: 2,
    completed: 6,
    rejected: 1,
    assignedLocation: 'T Nagar',
    teamSize: 3,
    lastTask: '2025-06-28',
  },
];

const AssignWorker = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state?.booking;

  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [workerAssignments, setWorkerAssignments] = useState({});

  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);


  const filteredWorkers = dummyWorkers
    .filter(worker => worker.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const valA = a[orderBy];
      const valB = b[orderBy];
      return (order === 'asc' ? valA > valB : valA < valB) ? 1 : -1;
    });


  const toggleService = (serviceId) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleWorkerToggle = (workerId, serviceId) => {
    setWorkerAssignments((prev) => {
      const currentServices = prev[workerId] || [];
      const updatedServices = currentServices.includes(serviceId)
        ? currentServices.filter((id) => id !== serviceId)
        : [...currentServices, serviceId];
      return {
        ...prev,
        [workerId]: updatedServices,
      };
    });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Assign Worker</h2>

        {bookingData ? (
          <>
            <div className="bg-white p-4 rounded shadow mb-6">
              <p><strong>Booking ID:</strong> {bookingData.booking.id}</p>
              <p><strong>Customer Name:</strong> {bookingData.booking.user_name}</p>
            </div>

            <h3 className="text-md font-semibold mb-2">Select Services:</h3>
            <div className="flex flex-wrap gap-4 mb-6">
              {bookingData.services.map((service) => (
                <label
                  key={service.id}
                  className="flex items-center gap-2 border px-4 py-2 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedServiceIds.includes(service.id)}
                    onChange={() => toggleService(service.id)}
                  />
                  {service.service_name}
                </label>
              ))}
            </div>

            {selectedServiceIds.length > 0 && (
              <>
                <h3 className="text-md font-semibold mb-2">Assign Workers:</h3>
                <div className="overflow-x-auto">
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Search Worker"
                      className="border rounded p-2 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <DataGrid
                    autoHeight
                    rows={filteredWorkers}
                    columns={[
                      { field: 'name', headerName: 'Name', flex: 1, renderCell: (params) => (
                          <span
                            style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => navigate(`/worker/${params.row.id}`, { state: { worker: params.row } })}
                          >
                            {params.value}
                          </span>
                        )
                      },
                      { field: 'location', headerName: 'Location', flex: 1 },
                      { field: 'assignedWorkInProgress', headerName: 'Assigned (WIP)', flex: 1 },
                      { field: 'completed', headerName: 'Completed', flex: 1 },
                      { field: 'rejected', headerName: 'Rejected', flex: 1 },
                      { field: 'assignedLocation', headerName: 'Assigned Location', flex: 1 },
                      { field: 'teamSize', headerName: 'Team Size', flex: 1 },
                      { field: 'lastTask', headerName: 'Last Task', flex: 1 },
                      ...selectedServiceIds.map((sid) => ({
                        field: `service_${sid}`,
                        headerName: bookingData.services.find(s => s.id === sid)?.service_name,
                        flex: 1,
                        sortable: false,
                        renderHeader: (params) => (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                           <input
                              type="checkbox"
                              checked={filteredWorkers.length > 0 && filteredWorkers.every((w) => workerAssignments[w.id]?.includes(sid))}
                              onChange={() => {
                                const isAllSelected = filteredWorkers.length > 0 && filteredWorkers.every((w) => workerAssignments[w.id]?.includes(sid));
                                const updated = { ...workerAssignments };
                                filteredWorkers.forEach((w) => {
                                  if (isAllSelected) {
                                    updated[w.id] = (updated[w.id] || []).filter(id => id !== sid);
                                  } else {
                                    if (!updated[w.id]) updated[w.id] = [];
                                    if (!updated[w.id].includes(sid)) updated[w.id].push(sid);
                                  }
                                });
                                setWorkerAssignments(updated);
                              }}
                            /> 
                            {params.colDef.headerName}
                            
                          </div>
                        ),
                        renderCell: (params) => (
                          <input
                            type="checkbox"
                            checked={workerAssignments[params.row.id]?.includes(sid) || false}
                            onChange={() => handleWorkerToggle(params.row.id, sid)}
                          />
                        ),
                        align: 'center',
                        headerAlign: 'center',
                      })),
                    ]}
                    pageSize={rowsPerPage}
                    onPageSizeChange={setRowsPerPage}
                    // rowsPerPageOptions={[5, 10, 25]}
                    pagination
                    page={page}
                    onPageChange={setPage}
                    disableSelectionOnClick
                  />

                </div>

                <pre className="mt-6 text-sm bg-gray-100 p-4 rounded">
                  <strong>Current Assignments:</strong><br />
                  {JSON.stringify(workerAssignments, null, 2)}
                </pre>
              </>
            )}
          </>
        ) : (
          <p className="text-red-500">No booking data provided.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AssignWorker;
