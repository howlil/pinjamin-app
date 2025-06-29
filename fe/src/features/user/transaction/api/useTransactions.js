import { useState, useEffect } from 'react';
import React from 'react';
import toast from 'react-hot-toast';
import { transactionAPI } from './transactionAPI';
import { extractErrorMessage } from '@/shared/services/apiErrorHandler';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from '../components/InvoicePDF';

export const useTransactions = (filters = {}) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10
    });

    const fetchTransactions = async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await transactionAPI.getTransactionHistory({
                ...filters,
                ...params
            });

            if (response.status === 'success') {
                setTransactions(response.data || []);
                setPagination(response.pagination || pagination);
            }
        } catch (err) {
            setError(extractErrorMessage(err));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const refetch = () => fetchTransactions();

    return {
        transactions,
        loading,
        error,
        pagination,
        fetchTransactions,
        refetch
    };
};

export const useTransactionInvoice = () => {
    const [loading, setLoading] = useState(false);

    const generateInvoice = async (bookingId) => {
        setLoading(true);
        try {
            // Validasi bookingId sebelum request
            if (!bookingId) {
                toast.error('ID booking tidak ditemukan');
                return false;
            }

            console.log('Generating invoice for bookingId:', bookingId); // Debug log
            const response = await transactionAPI.generateTransactionInvoice(bookingId);

            if (response.status === 'success' && response.data?.invoiceUrl) {
                // Open the invoice in a new tab for download
                const invoiceUrl = response.data.invoiceUrl.startsWith('http')
                    ? response.data.invoiceUrl
                    : `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000'}${response.data.invoiceUrl}`;

                window.open(invoiceUrl, '_blank');
                toast.success('Invoice berhasil dibuat dan akan diunduh');
                return true;
            }
        } catch (err) {
            const errorMessage = extractErrorMessage(err, 'Gagal membuat invoice');
            toast.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Generate PDF invoice locally using react-pdf
    const generatePDFInvoice = async (bookingId) => {
        setLoading(true);
        try {
            // Validasi bookingId sebelum request
            if (!bookingId) {
                toast.error('ID booking tidak ditemukan');
                return false;
            }

            console.log('Generating PDF invoice for bookingId:', bookingId); // Debug log
            const response = await transactionAPI.generateTransactionInvoice(bookingId);

            console.log('Full API response:', response); // Debug full response

            if (response.status === 'success' && response.data) {
                const invoiceData = response.data;

                // Debug log untuk melihat struktur data
                console.log('Invoice data received:', invoiceData);
                console.log('Invoice number:', invoiceData.invoiceNumber);
                console.log('Customer data:', invoiceData.customer);
                console.log('Item data:', invoiceData.item);

                // Enhanced validation with better error messages
                const missingFields = [];
                if (!invoiceData.invoiceNumber) missingFields.push('Invoice Number');
                if (!invoiceData.customer) missingFields.push('Customer Data');
                if (!invoiceData.item) missingFields.push('Item Data');
                if (!invoiceData.date) missingFields.push('Date');

                if (missingFields.length > 0) {
                    console.error('Missing required fields:', missingFields);
                    toast.error(`Data invoice tidak lengkap: ${missingFields.join(', ')}`);
                    return false;
                }

                // Additional validation for nested objects
                if (invoiceData.customer && (!invoiceData.customer.borrowerName || !invoiceData.customer.email)) {
                    console.error('Incomplete customer data:', invoiceData.customer);
                    toast.error('Data pelanggan tidak lengkap');
                    return false;
                }

                if (invoiceData.item && (!invoiceData.item.buildingName || !invoiceData.item.totalAmount)) {
                    console.error('Incomplete item data:', invoiceData.item);
                    toast.error('Data peminjaman tidak lengkap');
                    return false;
                }

                console.log('Starting PDF generation...');

                // Add transactionId to invoice data if available from URL or API
                const enhancedInvoiceData = {
                    ...invoiceData,
                    transactionId: invoiceData.transactionId || bookingId // fallback to bookingId if no transactionId
                };

                // Generate PDF using react-pdf
                const doc = React.createElement(InvoicePDF, { invoiceData: enhancedInvoiceData });
                console.log('PDF document created, generating blob...');

                const pdfBlob = await pdf(doc).toBlob();
                console.log('PDF blob generated, size:', pdfBlob.size);

                if (pdfBlob.size === 0) {
                    toast.error('PDF generation failed - empty file');
                    return false;
                }

                // Create download link with better filename
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;

                // Create a more descriptive filename
                const filename = `Invoice-${invoiceData.invoiceNumber || 'Unknown'}-${invoiceData.date?.replace(/\//g, '-') || 'Unknown'}.pdf`;
                link.download = filename;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                toast.success('Invoice PDF berhasil dibuat dan diunduh');
                return true;
            } else {
                console.error('Invalid response format:', response);
                toast.error('Gagal mendapatkan data invoice dari server');
                return false;
            }
        } catch (err) {
            console.error('PDF generation error:', err);
            console.error('Error stack:', err.stack);

            // Enhanced error handling
            if (err?.response?.status === 404) {
                toast.error('Data invoice tidak ditemukan');
            } else if (err?.response?.status === 403) {
                toast.error('Anda tidak memiliki akses untuk mengunduh invoice ini');
            } else {
                const errorMessage = extractErrorMessage(err, 'Gagal membuat PDF invoice');
                toast.error(errorMessage);
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        generateInvoice,
        generatePDFInvoice,
        loading
    };
};

