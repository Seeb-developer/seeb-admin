import React, { useRef, useState } from 'react'
import { apiCall } from 'utils/apiClient'
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

import { BlobProvider, PDFDownloadLink } from '@react-pdf/renderer';
import QuotationPDF from './component/QuotationPDF';

const QuotationForm = () => {
    const { id } = useParams()
    const [data, setdata] = useState([])
    const [timelines, setTimelines] = useState([])
    const pdfRef = useRef();

    const getquotationform = async () => {
        try {
            const result = await apiCall({
                endpoint: `quotation/quotationById/${id}`,
                method: 'GET',
            });
            if (result.status == 200) {
                setdata(result.data)
                setTimelines(result?.data?.timelines)
            }
        } catch (error) {
            console.log('error', error);
        }
    }
    useEffect(() => {
        getquotationform();
    }, [])
    const numberToWords = require('number-to-words');

    // Assuming data.total_amount is a number
    const totalAmount = data?.grand_total ? data?.grand_total : 0;

    // Convert the number to its text representation
    const totalAmountInWords = numberToWords.toWords(totalAmount);

    const maxDays = Math.max(...timelines?.map(timeline => parseInt(timeline.days)));

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <BlobProvider
                document={
                    <QuotationPDF
                        data={data}
                        totalAmountInWords={totalAmountInWords}
                        maxDays={maxDays}
                    />
                }
            >
                {({ url, loading, error }) =>
                    loading ? (
                        <p>Loading document...</p>
                    ) : error ? (
                        <p>Failed to load document: {error.message}</p>
                    ) : (
                        <div>
                            {/* View PDF */}
                            <iframe src={url} width="100%" height="800px" />

                            {/* Download PDF */}
                            <a
                                href={url}
                                download={`${data?.customer_name}_${data?.created_at}.pdf`}
                                style={{ display: 'block', marginTop: '10px', textAlign:'center' }}
                            >
                                Download PDF
                            </a>
                        </div>
                    )
                }
            </BlobProvider>
        </DashboardLayout >

    )
}


export default QuotationForm