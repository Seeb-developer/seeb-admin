import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Toaster, toast } from "react-hot-toast";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const BASE_URL = process.env.REACT_APP_HAPS_MAIN_BASE_URL;
const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

const PartnerVerification = () => {
    const location = useLocation();
    const id = location.state?.id || null;

    const [data, setData] = useState({ partner: {}, documents: [], bank_details: {} });
    const [loading, setLoading] = useState(true);

    const [bankRejectionReason, setBankRejectionReason] = useState("");
    const [showBankRejection, setShowBankRejection] = useState(false);

    const [docRejectionReason, setDocRejectionReason] = useState({});
    const [activeDocRejectId, setActiveDocRejectId] = useState(null);

    const calculateAge = (dob) => {
        const birth = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    };

    const fetchPartner = async () => {
        // setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}partner/onboarding-data/${id}`);
            const result = await res.json();
            setData(result.data);
        } catch {
            toast.error("Error fetching partner data");
        }
        setLoading(false);
    };

    const handleVerifyBank = async (status) => {
        if (status === "rejected" && !bankRejectionReason.trim()) {
            return toast.error("Rejection reason required");
        }

        try {
            const res = await fetch(`${BASE_URL}partner/verify-bank`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    partner_id: id,
                    status,
                    rejection_reason: bankRejectionReason,
                    verified_by: localStorage.getItem("id")
                })
            });
            const result = await res.json();
            if (result.status === 200) {
                toast.success("Bank verification updated");
                setShowBankRejection(false);
                setBankRejectionReason("");
                fetchPartner();
            }
        } catch {
            toast.error("Error verifying bank");
        }
    };

    const handleVerifyDocument = async (docId, status) => {
        if (status === "rejected" && !docRejectionReason[docId]?.trim()) {
            return toast.error("Rejection reason required");
        }

        try {
            const res = await fetch(`${BASE_URL}partner/verify-documents/${docId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    verified_by: localStorage.getItem("id"),
                    status,
                    rejection_reason: docRejectionReason[docId],
                }),
            });
            const result = await res.json();
            if (result.status === 200) {
                toast.success("Document verification updated");
                setActiveDocRejectId(null);
                fetchPartner();
            }
        } catch {
            toast.error("Error verifying document");
        }
    };

    useEffect(() => {
        fetchPartner();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin indicator={antIcon} />
            </div>
        );
    }

    const { partner, documents, bank_details } = data;

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" reverseOrder={false} />

            <div className="bg-white rounded-lg shadow p-8 m-6 border text-gray-800 space-y-10">
                <h2 className="text-3xl font-bold border-b pb-2">Partner Verification</h2>

                {/* Personal Info */}
                <div>
                    <h3 className="text-xl font-semibold border-b pb-1 mb-3">Personal Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <p><strong>Name:</strong> {partner.name}</p>
                        <p><strong>Mobile:</strong> {partner.mobile}</p>
                        <p><strong>DOB:</strong> {partner.dob} ({calculateAge(partner.dob)} years)</p>
                        <p><strong>Work:</strong> {partner.work}</p>
                        <p><strong>Labour Count:</strong> {partner.labour_count}</p>
                        <p><strong>Area:</strong> {partner.area}</p>
                        <p><strong>Service Areas:</strong> {partner.service_areas}</p>
                        <p><strong>Aadhaar No:</strong> {partner.aadhaar_no}</p>
                        <p><strong>PAN No:</strong> {partner.pan_no}</p>
                    </div>
                </div>

                {/* Bank Info */}
                <div>
                    <h3 className="text-xl font-semibold border-b pb-1 mb-3 flex justify-between items-center">
                        Bank Info
                        <span className={`capitalize text-xs font-medium px-3 py-1 rounded-full ${bank_details.status === 'verified' ? 'bg-green-100 text-green-600' : bank_details.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                            {bank_details.status}
                        </span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <p><strong>Account Holder:</strong> {bank_details.account_holder_name}</p>
                        <p><strong>Account Number:</strong> {bank_details.account_number}</p>
                        <p><strong>IFSC Code:</strong> {bank_details.ifsc_code}</p>
                        <p><strong>Branch:</strong> {bank_details.bank_branch}</p>
                    </div>
                    {bank_details.bank_document && (
                        <div className="border rounded-xl p-5 shadow-sm bg-white w-1/3 mt-5">
                            {/* Header: Title + Status */}
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Bank Document</h3>

                                <span className={`capitalize text-xs font-semibold px-2 py-0.5 rounded-full 
        ${bank_details.status === 'verified'
                                        ? 'bg-green-100 text-green-600'
                                        : bank_details.status === 'rejected'
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-yellow-100 text-yellow-600'}`}>
                                    {bank_details.status}
                                </span>
                            </div>

                            {/* Image */}
                            <div className="h-48 border rounded-lg overflow-hidden bg-gray-50">
                                <a
                                    href={`${BASE_URL}${bank_details.bank_document}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block h-48 border rounded-lg overflow-hidden bg-gray-50"
                                >
                                    <img
                                        src={`${BASE_URL}${bank_details.bank_document}`}
                                        alt="Bank Document"
                                        className="w-full h-full object-contain p-2"
                                    />
                                </a>

                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => handleVerifyBank("verified")}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-md"
                                >
                                    Verify
                                </button>
                                <button
                                    onClick={() => setShowBankRejection(true)}
                                    className="w-full border border-red-500 text-red-600 text-sm py-2 rounded-md hover:bg-red-50"
                                >
                                    Reject
                                </button>
                            </div>
                            {showBankRejection && (
                                <div className="mt-4">
                                    <textarea
                                        rows="3"
                                        placeholder="Enter rejection reason..."
                                        className="w-full border rounded-md p-2 text-sm"
                                        value={bankRejectionReason}
                                        onChange={(e) => setBankRejectionReason(e.target.value)}
                                    />
                                    <button
                                        onClick={() => handleVerifyBank("rejected")}
                                        className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded-md"
                                    >
                                        Submit Rejection
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Document Section */}
                <div>
                    <h3 className="text-2xl font-semibold mb-5">Documents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="border rounded-xl p-4 shadow-sm bg-white flex flex-col"
                            >
                                {/* Title + Status */}
                                <div className="flex justify-between items-center mb-3">
                                    <p className="font-medium text-lg capitalize">
                                        {doc.type.replace("_", " ")}
                                    </p>
                                    <span className={`capitalize text-xs font-semibold px-2 py-0.5 rounded-full 
                                    ${doc.status === 'verified'
                                            ? 'bg-green-100 text-green-600'
                                            : doc.status === 'rejected'
                                                ? 'bg-red-100 text-red-600'
                                                : 'bg-yellow-100 text-yellow-600'}`}>
                                        {doc.status}
                                    </span>

                                </div>

                                {/* Image */}
                                <div className="h-40 w-full border bg-gray-50 rounded-lg mb-4 overflow-hidden">
                                    <a
                                        href={`${BASE_URL}${doc.file_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block h-48 border rounded-lg overflow-hidden bg-gray-50"
                                    >
                                        <img
                                            src={`${BASE_URL}${doc.file_path}`}
                                            alt={doc.type}
                                            className="h-full w-full object-contain p-2"
                                        />
                                    </a>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleVerifyDocument(doc.id, "verified")}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-md"
                                    >
                                        Verify
                                    </button>
                                    <button
                                        onClick={() => setActiveDocRejectId(doc.id)}
                                        className="w-full border border-red-500 text-red-600 text-sm py-2 rounded-md hover:bg-red-50"
                                    >
                                        Reject
                                    </button>
                                </div>
                                {activeDocRejectId == doc.id && (

                                    <div className="mt-2">
                                        <textarea
                                            rows="3"
                                            className="w-full border text-sm rounded-md p-2 mb-3"
                                            placeholder="Enter rejection reason..."
                                            value={docRejectionReason[doc.id] || ""}
                                            onChange={(e) =>
                                                setDocRejectionReason((prev) => ({
                                                    ...prev,
                                                    [doc.id]: e.target.value,
                                                }))
                                            }
                                        />
                                        <button
                                            onClick={() => handleVerifyDocument(doc.id, "rejected")}
                                            className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded-md"
                                        >
                                            Submit Rejection
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default PartnerVerification;
