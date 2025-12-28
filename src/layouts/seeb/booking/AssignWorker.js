import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import {
  TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { apiCall } from 'utils/apiClient';

const AssignWorker = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state?.booking;

  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [workerAssignments, setWorkerAssignments] = useState({});
  const [serviceDetails, setServiceDetails] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [Workers, setWorkers] = useState([]);
  const [initialAssignments, setInitialAssignments] = useState({});


  const fetchWorkers = async () => {
    try {
      const res = await apiCall({ endpoint: "admin/partners/summary", method: "GET" });

      const Workers = (res?.data?.data ?? res?.data ?? []).map(worker => ({
        id: worker.id,
        name: worker.name,
        location: worker.location,
        assignedWorkInProgress: worker.in_progress,
        completed: worker.completed,
        rejected: worker.rejected,
        assignedLocation: worker.assigned_location,
        teamSize: worker.team_size,
        lastTask: worker.last_task,
        profession: worker.profession,
      }));
      setWorkers(Workers);

      console.log("Fetched workers:", Workers);

    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  useEffect(() => {
    if (bookingData?.services?.length > 0) {
      fetchInitialAssignments();
    }
  }, [bookingData]);


  const fetchInitialAssignments = async () => {
    if (!bookingData?.services) return;

    try {
      const updatedAssignments = {};

      for (const service of bookingData.services) {
        const serviceId = service.id;

        const res = await apiCall({ endpoint: `assignment/booking-requests/${serviceId}`, method: "GET" });
        const assigned = res?.data?.data ?? res?.data ?? [];

        if (assigned.length > 0) {
          updatedAssignments[serviceId] = assigned.map((a) => Number(a.partner_id));
        }
      }

      setWorkerAssignments(updatedAssignments);
      setInitialAssignments(updatedAssignments);
    } catch (err) {
      console.error("Error fetching initial assignments:", err);
    }
  };

  console.log("WorkerAssignments", workerAssignments)


  const filteredWorkers = Workers
    .filter(worker =>
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedProfession ? worker.profession === selectedProfession : true)
    )
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
  workerId = Number(workerId); // force type

  setWorkerAssignments((prev) => {
    const currentWorkers = prev[serviceId] || [];
    const updatedWorkers = currentWorkers.includes(workerId)
      ? currentWorkers.filter((id) => id !== workerId)
      : [...currentWorkers, workerId];

    return {
      ...prev,
      [serviceId]: updatedWorkers,
    };
  });
};


  const handleServiceToggle = (sid, filteredWorkers) => {
    setWorkerAssignments((prev) => {
      const currentWorkers = prev[sid] || [];
      const isAllSelected = filteredWorkers.every((w) =>
        currentWorkers.includes(w.id)
      );

      let updatedWorkers;
      if (isAllSelected) {
        // Unassign all workers from this service
        updatedWorkers = currentWorkers.filter(
          (id) => !filteredWorkers.some((w) => w.id === id)
        );
      } else {
        // Assign all filtered workers to this service
        const newWorkerIds = filteredWorkers
          .map((w) => w.id)
          .filter((id) => !currentWorkers.includes(id));
        updatedWorkers = [...currentWorkers, ...newWorkerIds];
      }

      return {
        ...prev,
        [sid]: updatedWorkers,
      };
    });
  };

  const prepareAssignmentPayload = () => {
    return selectedServiceIds.map(sid => ({
      booking_service_id: sid,
      partner_ids: workerAssignments[sid] || [],
      amount: serviceDetails[sid]?.amount || 0,
      helper_count: serviceDetails[sid]?.helper_count || 0,
      estimated_completion_date: serviceDetails[sid]?.estimated_completion_date || null
    }));
  };


  const handleSubmit = async () => {

    const assignments = selectedServiceIds.map((sid) => ({
      booking_service_id: Number(sid),
      partner_ids: workerAssignments[sid] || [],
      amount: serviceDetails[sid]?.amount || 0,
      helper_count: serviceDetails[sid]?.helper_count || 0,
      estimated_completion_date: serviceDetails[sid]?.estimated_completion_date || null,
    }));

    const payload = { assignments };

    console.log("Submitting payload:", payload);

    try {
      const res = await apiCall({ endpoint: "assignment/create-requests", method: "POST", data: payload });
      console.log('✅ Success:', res);
      alert('Assignments submitted successfully!');
    } catch (error) {
      console.error('❌ Submission failed:', error);
      alert('Failed to submit assignments. Please try again.');
    }
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
                  <div className=" flex gap-4 items-center mb-4">
                    <select
                      className="border rounded p-2"
                      value={selectedProfession}
                      onChange={(e) => setSelectedProfession(e.target.value)}
                    >
                      <option value="">All Professions</option>
                      {[...new Set(Workers.map(w => w.profession))].map((profession, index) => (
                        <option key={index} value={profession}>
                          {profession}
                        </option>
                      ))}
                    </select>
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
                      {
                        field: 'name', headerName: 'Name', flex: 1, renderCell: (params) => (
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
                              checked={filteredWorkers.length > 0 && filteredWorkers.every((w) => workerAssignments[sid]?.includes(w.id))}
                              onChange={() => {
                                handleServiceToggle(sid, filteredWorkers)
                              }}
                            />
                            {params.colDef.headerName}

                          </div>
                        ),
                        renderCell: (params) => {
                            const workerId = Number(params.row.id);

                          const isAssigned = workerAssignments[sid]?.includes(workerId);

                          return (
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isAssigned}
                                onChange={() => handleWorkerToggle(workerId, sid)}
                              />
                            </div>
                          );
                        },
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

                  {selectedServiceIds.map((sid) => {
                    const service = bookingData.services.find(s => s.id === sid);
                    const details = serviceDetails[sid] || {};

                    // Parse addons from JSON string
                    let parsedAddons = [];
                    try {
                      parsedAddons = service.addons ? JSON.parse(service.addons) : [];
                    } catch (err) {
                      console.error("Invalid addons JSON for service ID:", sid);
                    }

                    return (
                      <div key={sid} className="mb-6 bg-white p-4 rounded shadow">
                        <h4 className="font-semibold mb-2">{service.service_name} Details</h4>

                        {/* Static service values from bookingData */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <strong>Base Amount:</strong><br />
                            ₹{service.amount || 0}
                          </div>
                          <div>
                            <strong>Rate:</strong><br />
                            ₹{service.rate} {service.rate_type && <span className="text-gray-500">({service.rate_type})</span>}
                          </div>
                          <div>
                            <strong>Value:</strong><br />
                            {service.value} {service.rate_type && <span className="text-gray-500">({service.rate_type})</span>}
                          </div>

                        </div>

                        {/* Addons display */}
                        {parsedAddons.length > 0 && (
                          <div className="mb-4">
                            <strong>Addons:</strong>
                            <div className="mt-2 border rounded p-3 bg-gray-50">
                              {parsedAddons.map((addon, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-2">
                                  <div><strong>Name:</strong> {addon.name}</div>
                                  <div><strong>Price:</strong> ₹{addon.price} <span className="text-gray-500">({addon.price_type})</span></div>
                                  <div><strong>Qty:</strong> {addon.qty}</div>
                                  <div><strong>Total:</strong> ₹{addon.qty * addon.price}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Assignment Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <input
                            type="number"
                            placeholder="Enter Amount"
                            value={details.amount || ''}
                            onChange={(e) =>
                              setServiceDetails(prev => ({
                                ...prev,
                                [sid]: { ...prev[sid], amount: +e.target.value }
                              }))
                            }
                            className="border rounded p-2"
                          />

                          <input
                            type="number"
                            placeholder="Helper Count"
                            value={details.helper_count || ''}
                            onChange={(e) =>
                              setServiceDetails(prev => ({
                                ...prev,
                                [sid]: { ...prev[sid], helper_count: +e.target.value }
                              }))
                            }
                            className="border rounded p-2"
                          />

                          <input
                            type="date"
                            placeholder="Estimated Completion Date"
                            value={details.estimated_completion_date || ''}
                            onChange={(e) =>
                              setServiceDetails(prev => ({
                                ...prev,
                                [sid]: { ...prev[sid], estimated_completion_date: e.target.value }
                              }))
                            }
                            className="border rounded p-2"
                          />
                        </div>
                      </div>
                    );
                  })}



                </div>

                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mt-6"
                >
                  Submit Assignments
                </button>

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
