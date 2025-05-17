import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import PropTypes from 'prop-types';

// Define A4 dimensions and styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    section: {
        marginBottom: 10,
        padding: 10,
        borderBottom: '0.5 solid black',
        borderRadius: 0,
    },
    logo: {
        width: 80,
        height: 50,
        marginRight: 15, // Space between the logo and the text
        objectFit: 'contain',
    },
    headerContainer: {
        flex: 1, // Take up the remaining space after the logo
    },
    header: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subHeader: {
        fontSize: 10,
        textAlign: 'center',
        color: 'gray',
    },
    row: {
        flexDirection: 'row',
        marginVertical: 4,
    },
    label: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 10,
        marginLeft: 6,
    },
    divider: {
        marginVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    letterheadSection: {
        marginBottom: 20,
        padding: 10,
        borderBottom: '0.5 solid black',
        flexDirection: 'row', // Align items horizontally
        alignItems: 'center', // Vertically center content
    },
    table: {
        display: 'table',
        width: 'auto',
        borderWidth: 1,
        borderColor: 'black',
        marginVertical: 10,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableHeader: {
        backgroundColor: '#f2f2f2',
        borderWidth: 1,
        borderColor: 'black',
        textAlign: 'center',
        padding: 4,
        fontWeight: 'bold',
    },
    tableCell: {
        borderColor: 'black',
        padding: 4,
        textAlign: 'center',
        borderBottom: 0.5,
        borderLeft: 0.5,
        fontFamily: "Helvetica"
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    chartContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    chartBar: {
        height: 20,
        marginBottom: 6,
        borderRadius: 5,
    },
    chartLabel: {
        fontSize: 10,
        marginBottom: 4,
        fontWeight: 'bold',
        width: '20%'
    },
    chartBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footer: {
        marginVertical: 20,
        textAlign: "left",
        fontSize: 10,
    },
    boldText: {
        fontWeight: "bold",
    },
    blueText: {
        color: "#1E90FF",
        fontSize: 9,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 10,
        textDecoration: "underline",
    },
    terms: {
        fontSize: 10,
        lineHeight: 1.5,
        marginBottom: 5,
    },
});

// Quotation PDF Component
const QuotationPDF = ({ data, totalAmountInWords, maxDays }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header Section */}
            <View style={styles.letterheadSection}>
                <Image
                    style={styles.logo}
                    src="https://arrangefree.com/green-logo.png"
                />
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>ARRANGE FREE INTERIOR COMPANY</Text>
                    <Text style={styles.subHeader}>
                        Renovation | Customized Furniture | Flooring | Modern Kitchen | Lighting And False Ceiling | Soft Furnishing
                    </Text>
                </View>
            </View>

            {/* Customer Information */}
            <View style={styles.section}>
                <View style={[styles.row, { marginHorizontal: 10, justifyContent: "space-between" }]}>
                    <View style={[styles.row,]}>
                        <Text style={styles.label}>Quotation No:</Text>
                        <Text style={styles.value}>#{data?.id}</Text>
                    </View>
                    <View style={[]}>
                        <View style={styles.row}>
                            <Text style={styles.label}>Date:</Text>
                            <Text style={styles.value}>{data?.created_at?.slice(0, 10)}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Time:</Text>
                            <Text style={styles.value}>{data?.created_at?.slice(10)}</Text>
                        </View>
                    </View>

                </View>

                <View style={[styles.row, { marginHorizontal: 10 }]}>
                    <Text style={styles.label}>To:</Text>
                    <Text style={styles.value}>{data?.customer_name}</Text>
                </View>
                <View style={[styles.row, { marginHorizontal: 10, width: '50%' }]}>
                    <Text style={styles.label}>Address:</Text>
                    <Text style={styles.value}>{data?.address}</Text>
                </View>
                <View style={[styles.row, { marginHorizontal: 10 }]}>
                    <Text style={styles.label}>Mobile No:</Text>
                    <Text style={styles.value}>{data?.phone}</Text>
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.header}>Subject: Your requirement of interior services</Text>
            </View>
            <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableRow}>
                    <Text style={[styles.tableHeader, { flex: 1 }]}>Sr.No.</Text>
                    <Text style={[styles.tableHeader, { flex: 3 }]}>Description</Text>
                    <Text style={[styles.tableHeader, { flex: 1 }]}>Size</Text>
                    <Text style={[styles.tableHeader, { flex: 1 }]}>Quantity</Text>
                    <Text style={[styles.tableHeader, { flex: 1 }]}>Rate</Text>
                    <Text style={[styles.tableHeader, { flex: 1 }]}>Amount</Text>
                </View>

                {/* Table Body */}
                {data?.items?.map((item, index) => (
                    <View key={item.id}>
                        {/* Item Title Row */}
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 6, fontWeight: 'bold', textAlign: 'center' }]}>
                                {item.title}
                            </Text>
                        </View>

                        {/* Subfields */}
                        {item?.subfiled?.map((subfield, subIndex) => (
                            <View key={subIndex} style={styles.tableRow}>
                                <Text style={[styles.tableCell, { flex: 1 }]}>{index + 1}.{subIndex + 1}</Text>
                                <Text style={[styles.tableCell, { flex: 3 }]}>{subfield.description}</Text>
                                <Text style={[styles.tableCell, { flex: 1 }]}>{subfield.size}</Text>
                                <Text style={[styles.tableCell, { flex: 1 }]}>{subfield.quantity}</Text>
                                <Text style={[styles.tableCell, { flex: 1 }]}>{subfield.rate}</Text>
                                <Text style={[styles.tableCell, { flex: 1 }]}>{subfield.amount}</Text>
                            </View>
                        ))}

                    </View>
                ))}
                <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 3 }]}></Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>Sub Total:</Text>
                    <Text style={[styles.tableCell, { flex: 2, fontFamily: "Helvetica" }]}> {data?.total}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 3 }]}></Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>Discount:</Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>{data?.discount}%</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 3 }]}></Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>Discount Amount:</Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>{data?.discount_amount}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 3 }]}></Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>SGST:</Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>{data?.sgst}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 3 }]}></Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>CGST:</Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>{data?.cgst}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 3 }]}></Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>Grand Total:</Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>{data?.grand_total}</Text>
                </View>
                {/* Amount in Words Row */}
                <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 6, fontWeight: 'bold', textAlign: 'left', textTransform: "capitalize", marginLeft: 10 }]}>
                        Amount in Words:  {totalAmountInWords}
                    </Text>
                </View>
            </View>

            {/* Payment Slab Section */}
            <Text style={[styles.bold, { fontSize: 14, marginVertical: 10 }]}>
                Payment Slab
            </Text>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 3, fontWeight: 'bold' }]}>Payment Slab</Text>
                    <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Percentage</Text>
                    <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Amount</Text>
                    <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Due Date</Text>
                </View>

                {data?.installments?.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={[styles.tableCell, { flex: 3 }]}>
                            {item.label}
                        </Text>
                        <Text style={[styles.tableCell, { flex: 2 }]}>
                            {item.percentage}%
                        </Text>
                        <Text style={[styles.tableCell, { flex: 2 }]}>
                            {parseFloat(item.amount).toFixed(2)}
                        </Text>
                        <Text style={[styles.tableCell, { flex: 2 }]}>
                            {item.due_date}
                        </Text>
                    </View>
                ))}
            </View>
            <Text style={[styles.bold, { fontSize: 14, marginVertical: 10 }]}>
                Material List
            </Text>
            <View style={styles.table}>

                {/* Table Header */}
                {data?.mark_list?.map((category, index) => (
                    <View key={index}>
                        {/* Category Row */}
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 5, fontWeight: 'bold', fontSize: 11 }]}>
                                {category.title}
                            </Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>
                                Mark
                            </Text>
                        </View>

                        {/* Mapping through the items in the category */}
                        {category?.children?.map((item, idx) => (
                            <View key={idx} style={styles.tableRow}>
                                <Text style={[styles.tableCell, { flex: 5, fontWeight: 'light', fontSize: 9 }]}>
                                    {item.title}
                                </Text>
                                <Text style={[styles.tableCell, { flex: 2, textAlign: 'center' }]}>
                                    {/* Mark column */}
                                    <Text style={{ color: 'green' }}>✔</Text> {/* Tick mark */}
                                </Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
            <Text style={[styles.bold, { fontSize: 14, marginVertical: 10 }]}>
                Project Timeline
            </Text>
            <View style={styles.chartContainer}>
                {data?.timelines?.map((timeline) => {
                    const task = timeline.task;
                    const days = parseInt(timeline.days);
                    const barWidth = (days / maxDays) * 300;  // Normalize bar length based on max days

                    return (
                        <View key={timeline.id} style={styles.chartBarContainer}>
                            <Text style={styles.chartLabel}>{task}</Text>
                            <View style={[styles.chartBar, { width: barWidth, backgroundColor: '#4BC0C0' }]} />
                            <Text style={styles.chartLabel}>{days} days</Text>
                        </View>
                    );
                })}
                <Text style={[styles.header, { fontSize: 14, marginVertical: 10 }]}>
                    Total Days - {data?.timelines?.reduce((acc, curr) => acc + parseInt(curr.days), 0)}
                </Text>
            </View>
            <View style={styles.footer}>
                <Text style={styles.boldText}>Thanks</Text>
                <Text style={[styles.boldText, { marginTop: 5 }]}>{data.created_by_name}</Text>
                <Text style={[styles.boldText, { marginTop: 5 }]}>
                    Arrangr Free Interior Company
                </Text>
                <Text style={{ marginTop: 5 }}>
                    Mobile No:{" "}
                    <Text style={styles.blueText}>+91 {data.mobile_no}</Text>
                </Text>
                <Text style={{ marginTop: 5 }}>
                    Website:{" "}
                    <Text style={styles.blueText}>www.arrangefree.com</Text>
                </Text>
            </View>
            {/* Terms and Conditions Section */}
            <Text style={[styles.bold, { fontSize: 14, marginVertical: 10 }]}>Terms and Conditions</Text>
            <View>
                <Text style={styles.terms}>
                    1. Scope of the quotation is limited to above mentioned areas.
                </Text>
                <Text style={styles.terms}>
                    2. Any changes in the approved design will attract additional cost, quotation, and longer delivery period.
                </Text>
                <Text style={styles.terms}>
                    3. Bathroom, terrace, passage, study room, balcony, open plot, dry balcony, and wash basin are treated as different entities.
                </Text>
                <Text style={styles.terms}>
                    4. Design, painting, furnishing, electrical fit-out/work, and other fittings for the above entities are not included in the quotation unless requested specifically.
                </Text>
                <Text style={styles.terms}>
                    5. Any delay in the selection process of electronic/electrical/furnishing/other fittings will proportionately delay the delivery timelines.
                </Text>
                <Text style={styles.terms}>
                    6. Warranty: Electrical fittings – 2 years; electronic/electrical gadgets (as per manufacturer guarantee policy).
                </Text>
                <Text style={styles.terms}>7. Warranty: Furniture hardware – 10 years.</Text>
            </View>

            <Text style={[styles.bold, { fontSize: 14, marginVertical: 10 }]}>Payment Terms</Text>
            <View>
                <Text style={styles.terms}>
                    Payment terms are structured to align with key project milestones, ensuring transparency and seamless execution. Clients are requested to adhere to the agreed payment schedule to maintain project timelines. In case of any delays, we encourage open communication to find a suitable resolution and minimize disruptions.                </Text>
                <Text style={styles.subSection}>Payment Schedule:</Text>
                <Text style={styles.terms}>
                    • <Text style={styles.listItem}>20% Initial Payment:</Text> To confirm the project and commence the design phase. Covers design, false ceiling work, and electrical work completion.
                </Text>
                <Text style={styles.terms}>
                    • <Text style={styles.listItem}>35% Furniture Payment:</Text> Due before the start of furniture manufacturing and installation.
                </Text>
                <Text style={styles.terms}>
                    • <Text style={styles.listItem}>35% Final Procurement Payment:</Text> Due prior to the procurement of hardware and soft furnishing materials.
                </Text>

                <Text style={styles.subSection}>Modes of Payment:</Text>
                <Text style={styles.terms}>
                    • Online bank transfers (details provided in the invoice).
                </Text>
                <Text style={styles.terms}>
                    • Cheque payments (subject to clearance).
                </Text>
                <Text style={styles.terms}>
                    • Accepted digital payment platforms (as specified by the company).
                </Text>

                <Text style={styles.subSection}>Taxes and Additional Charges:</Text>
                <Text style={styles.terms}>
                    • All payments are subject to GST and applicable taxes as per government regulations.
                </Text>
                <Text style={styles.terms}>
                    • Any additional requests or changes by the client beyond the original scope of work will incur separate charges.
                </Text>
            </View>
            <View style={styles.footer}>
                <Text>724, 7th Floor, Clover Hills Plaza, NIBM Road, Mohammadwadi, Pune Maharashtra – 411048</Text>
                <Text>
                    Phone: <Text style={styles.blueText}>+91 9371885000</Text>
                </Text>
                <Text>
                    Email Id:{" "} <Text style={styles.blueText}>info@arrangefree.com</Text>
                </Text>
                <Text>
                    Website: <Text style={styles.blueText}>www.arrangefree.com</Text>
                </Text>
            </View>
        </Page>
    </Document >
);

// Prop Types for Data Validation
QuotationPDF.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.string.isRequired,
        created_at: PropTypes.string.isRequired,
        customer_name: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        total: PropTypes.number.isRequired,
        discount: PropTypes.number.isRequired,
        discount_amount: PropTypes.number.isRequired,
        sgst: PropTypes.number.isRequired,
        cgst: PropTypes.number.isRequired,
        grand_total: PropTypes.number.isRequired,
        created_by_name:PropTypes.string.isRequired,
        mobile_no:PropTypes.string.isRequired,
        installments: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                percentage: PropTypes.number.isRequired,
                amount: PropTypes.string.isRequired,
                due_date: PropTypes.string.isRequired,
            })
        ).isRequired,
        mark_list: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string.isRequired,
                children: PropTypes.arrayOf(
                    PropTypes.shape({
                        title: PropTypes.string.isRequired,
                    })
                ).isRequired,
            })
        ).isRequired,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string.isRequired,
                subfiled: PropTypes.arrayOf(
                    PropTypes.shape({
                        description: PropTypes.string.isRequired,
                        size: PropTypes.string.isRequired,
                        quantity: PropTypes.number.isRequired,
                        rate: PropTypes.number.isRequired,
                        amount: PropTypes.number.isRequired,
                    })
                ).isRequired,
            })
        ).isRequired,
        timelines: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                quotation_id: PropTypes.string.isRequired,
                task: PropTypes.string.isRequired,
                days: PropTypes.string.isRequired,
            })
        ).isRequired,
    }).isRequired,
    totalAmountInWords: PropTypes.string.isRequired,
    maxDays: PropTypes.string.isRequired,
};

export default QuotationPDF;
