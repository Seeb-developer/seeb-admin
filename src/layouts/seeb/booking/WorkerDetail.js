import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const WorkerDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const worker = location.state?.worker;

    if (!worker) {
        return <p className="p-6 text-red-500">No worker data provided.</p>;
    }

    // Dummy work history
    const workHistory = [
        { id: 1, service: 'Interior Painting', location: 'Baner', status: 'Completed', date: '2025-06-18' },
        { id: 2, service: 'False Ceiling', location: 'Wakad', status: 'Completed', date: '2025-06-10' },
        { id: 3, service: 'Electrician', location: 'Hinjewadi', status: 'Rejected', date: '2025-05-28' },
        { id: 4, service: 'Plumbing', location: 'Kothrud', status: 'In Progress', date: '2025-07-01' },
    ];

    // Dummy payment history
    const paymentHistory = [
        { id: 1, amount: 2500, status: 'Paid', method: 'UPI', date: '2025-06-20', service: 'Interior Painting' },
        { id: 2, amount: 1800, status: 'Paid', method: 'Bank Transfer', date: '2025-06-12', service: 'False Ceiling' },
        { id: 3, amount: 1200, status: 'Pending', method: 'Cash', date: '2025-07-01', service: 'Plumbing' },
    ];

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <div className="p-6 space-y-6">
                <button onClick={() => navigate(-1)} className="text-blue-500  text-sm">← Back</button>

                <h2 className="text-2xl font-bold">Worker Detail: {worker.name}</h2>

                {/* Worker Summary */}
                <div className="bg-white rounded-lg shadow p-6 space-y-2 text-sm">
                    <p><strong>Location:</strong> {worker.location}</p>
                    <p><strong>Assigned Location:</strong> {worker.assignedLocation}</p>
                    <p><strong>Team Size:</strong> {worker.teamSize}</p>
                    <p><strong>Last Task Assigned:</strong> {worker.lastTask}</p>
                    <p><strong>Assigned (WIP):</strong> {worker.assignedWorkInProgress}</p>
                    <p><strong>Completed Tasks:</strong> {worker.completed}</p>
                    <p><strong>Rejected Tasks:</strong> {worker.rejected}</p>
                </div>

                {/* Work History Table */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Work History</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border rounded text-sm">
                            <thead className="bg-gray-100 text-left">
                                <tr>
                                    <th className="px-4 py-2 border">Service</th>
                                    <th className="px-4 py-2 border">Location</th>
                                    <th className="px-4 py-2 border">Status</th>
                                    <th className="px-4 py-2 border">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workHistory.map((job) => (
                                    <tr key={job.id}>
                                        <td className="px-4 py-2 border">{job.service}</td>
                                        <td className="px-4 py-2 border">{job.location}</td>
                                        <td className={`px-4 py-2 border ${job.status === 'Completed' ? 'text-green-600' : job.status === 'Rejected' ? 'text-red-500' : 'text-yellow-600'}`}>
                                            {job.status}
                                        </td>
                                        <td className="px-4 py-2 border">{job.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Payment History Table */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Payment History</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border rounded text-sm">
                            <thead className="bg-gray-100 text-left">
                                <tr>
                                    <th className="px-4 py-2 border">Service</th>
                                    <th className="px-4 py-2 border">Amount (₹)</th>
                                    <th className="px-4 py-2 border">Status</th>
                                    <th className="px-4 py-2 border">Method</th>
                                    <th className="px-4 py-2 border">Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paymentHistory.map((payment) => (
                                    <tr key={payment.id}>
                                        <td className="px-4 py-2 border">{payment.service}</td>
                                        <td className="px-4 py-2 border">₹{payment.amount}</td>
                                        <td className={`px-4 py-2 border ${payment.status === 'Paid' ? 'text-green-600' : 'text-orange-500'}`}>
                                            {payment.status}
                                        </td>
                                        <td className="px-4 py-2 border">{payment.method}</td>
                                        <td className="px-4 py-2 border">{payment.date}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default WorkerDetail;
