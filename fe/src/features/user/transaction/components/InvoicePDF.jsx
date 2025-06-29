import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Use default font for now to avoid font loading issues
// Font.register({
//     family: 'Inter',
//     src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
// });

// Define styles that mimic glassmorphism design
const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 12,
        backgroundColor: '#EDFFF4',
        padding: 40,
        color: '#2A2A2A',
    },
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        border: '1pt solid #D7D7D7',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#D7D7D7',
    },
    logo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#21D179',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    invoiceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2A2A2A',
        textAlign: 'right',
    },
    invoiceNumber: {
        fontSize: 12,
        color: '#666',
        textAlign: 'right',
        marginTop: 4,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#21D179',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    customerInfo: {
        backgroundColor: '#F0FFF4',
        padding: 16,
        borderRadius: 12,
        border: '1pt solid #21D179',
        marginBottom: 20,
    },
    customerRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    customerLabel: {
        fontSize: 11,
        color: '#666',
        width: 100,
        fontWeight: 'bold',
    },
    customerValue: {
        fontSize: 11,
        color: '#2A2A2A',
        flex: 1,
    },
    itemContainer: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        border: '1pt solid #D7D7D7',
        marginBottom: 20,
    },
    itemHeader: {
        flexDirection: 'row',
        backgroundColor: '#E8F5E8',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    itemHeaderText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#21D179',
        flex: 1,
        textAlign: 'center',
    },
    itemRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(215, 215, 215, 0.3)',
    },
    itemCell: {
        fontSize: 11,
        color: '#2A2A2A',
        flex: 1,
        textAlign: 'center',
    },
    totalSection: {
        backgroundColor: '#F0FFF4',
        padding: 20,
        borderRadius: 12,
        border: '1pt solid #21D179',
        marginTop: 20,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    totalLabel: {
        fontSize: 14,
        color: '#2A2A2A',
        fontWeight: 'bold',
    },
    totalAmount: {
        fontSize: 16,
        color: '#21D179',
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 40,
        padding: 20,
        backgroundColor: 'rgba(215, 215, 215, 0.1)',
        borderRadius: 12,
        textAlign: 'center',
    },
    footerText: {
        fontSize: 10,
        color: '#666',
        lineHeight: 1.4,
    },
    watermark: {
        position: 'absolute',
        top: 300,
        left: 200,
        fontSize: 60,
        color: '#F0F0F0',
        fontWeight: 'bold',
        zIndex: -1,
    },
    date: {
        fontSize: 11,
        color: '#666',
        textAlign: 'right',
        marginTop: 8,
    },
    paymentMethod: {
        backgroundColor: '#21D179',
        color: 'white',
        padding: '4 12',
        borderRadius: 20,
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        width: 120,
        alignSelf: 'flex-end',
    }
});

const InvoicePDF = ({ invoiceData }) => {
    console.log('InvoicePDF component received data:', invoiceData);

    if (!invoiceData) {
        console.error('InvoicePDF: No invoice data provided');
        return null;
    }

    // Validate required fields
    if (!invoiceData.invoiceNumber || !invoiceData.customer || !invoiceData.item) {
        console.error('InvoicePDF: Missing required fields:', {
            hasInvoiceNumber: !!invoiceData.invoiceNumber,
            hasCustomer: !!invoiceData.customer,
            hasItem: !!invoiceData.item
        });
        return null;
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateStr) => {
        try {
            const [day, month, year] = dateStr.split('-');
            const date = new Date(year, month - 1, day);
            return date.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateStr;
        }
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Watermark */}
                <Text style={styles.watermark}>PINJAMIN</Text>

                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.logo}>PINJAMIN</Text>
                            <Text style={{ fontSize: 10, color: '#666', marginTop: 4 }}>
                                Sistem Peminjaman Gedung
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.invoiceTitle}>INVOICE</Text>
                            <Text style={styles.invoiceNumber}>
                                {invoiceData.invoiceNumber}
                            </Text>
                            <Text style={styles.date}>
                                {formatDate(invoiceData.date)}
                            </Text>
                            <View style={styles.paymentMethod}>
                                <Text>{invoiceData.paymentMethod?.replace('_', ' ')}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Customer Information */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Informasi Pelanggan</Text>
                        <View style={styles.customerInfo}>
                            <View style={styles.customerRow}>
                                <Text style={styles.customerLabel}>Nama:</Text>
                                <Text style={styles.customerValue}>
                                    {invoiceData.customer.borrowerName}
                                </Text>
                            </View>
                            <View style={styles.customerRow}>
                                <Text style={styles.customerLabel}>Email:</Text>
                                <Text style={styles.customerValue}>
                                    {invoiceData.customer.email}
                                </Text>
                            </View>
                            <View style={styles.customerRow}>
                                <Text style={styles.customerLabel}>Telepon:</Text>
                                <Text style={styles.customerValue}>
                                    {invoiceData.customer.phoneNumber}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Item Details */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Detail Peminjaman</Text>
                        <View style={styles.itemContainer}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemHeaderText}>Gedung</Text>
                                <Text style={styles.itemHeaderText}>Tanggal</Text>
                                <Text style={styles.itemHeaderText}>Waktu</Text>
                                <Text style={styles.itemHeaderText}>Biaya</Text>
                            </View>

                            <View style={styles.itemRow}>
                                <Text style={styles.itemCell}>
                                    {invoiceData.item.buildingName}
                                </Text>
                                <Text style={styles.itemCell}>
                                    {invoiceData.item.startDate}
                                    {invoiceData.item.endDate !== invoiceData.item.startDate &&
                                        ` - ${invoiceData.item.endDate}`
                                    }
                                </Text>
                                <Text style={styles.itemCell}>
                                    {invoiceData.item.startTime} - {invoiceData.item.endTime}
                                </Text>
                                <Text style={styles.itemCell}>
                                    {formatCurrency(invoiceData.item.totalAmount)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Total Section */}
                    <View style={styles.totalSection}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>TOTAL PEMBAYARAN</Text>
                            <Text style={styles.totalAmount}>
                                {formatCurrency(invoiceData.item.totalAmount)}
                            </Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 8,
                            paddingTop: 8,
                            borderTopWidth: 1,
                            borderTopColor: 'rgba(33, 209, 121, 0.3)'
                        }}>
                            <Text style={{ fontSize: 10, color: '#666' }}>
                                Status: LUNAS
                            </Text>
                            <Text style={{ fontSize: 10, color: '#666' }}>
                                Metode: {invoiceData.paymentMethod?.replace('_', ' ')}
                            </Text>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Terima kasih atas pembayaran Anda. Invoice ini merupakan bukti sah pembayaran
                            untuk peminjaman gedung. Harap simpan invoice ini untuk keperluan administrasi.
                        </Text>
                        <Text style={[styles.footerText, { marginTop: 8, fontWeight: 'bold' }]}>
                            PINJAMIN - Sistem Peminjaman Gedung
                        </Text>
                        <Text style={[styles.footerText, { fontSize: 9, marginTop: 4 }]}>
                            Dokumen ini dibuat secara otomatis pada {formatDate(invoiceData.date)}
                        </Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default InvoicePDF; 