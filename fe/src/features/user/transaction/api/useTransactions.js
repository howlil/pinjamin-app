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

    const generateInvoice = async (bookingsId) => {
        setLoading(true);
        try {
            // Validasi bookingsId sebelum request
            if (!bookingsId) {
                toast.error('ID booking tidak ditemukan');
                return false;
            }

            console.log('Generating invoice for bookingsId:', bookingsId); // Debug log
            const response = await transactionAPI.generateTransactionInvoice(bookingsId);

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
    const generatePDFInvoice = async (bookingsId) => {
        setLoading(true);
        try {
            // Validasi bookingsId sebelum request
            if (!bookingsId) {
                toast.error('ID booking tidak ditemukan');
                return false;
            }

            console.log('Generating PDF invoice for bookingsId:', bookingsId); // Debug log
            const response = await transactionAPI.generateTransactionInvoice(bookingsId);

            console.log('Full API response:', response); // Debug full response

            if (response.status === 'success' && response.data) {
                const invoiceData = response.data;

                // Debug log untuk melihat struktur data
                console.log('Invoice data received:', invoiceData);
                console.log('Invoice number:', invoiceData.invoiceNumber);
                console.log('Customer data:', invoiceData.customer);
                console.log('Item data:', invoiceData.item);

                // Pastikan data sesuai format yang diharapkan InvoicePDF
                if (!invoiceData.invoiceNumber || !invoiceData.customer || !invoiceData.item) {
                    console.error('Missing data fields:', {
                        hasInvoiceNumber: !!invoiceData.invoiceNumber,
                        hasCustomer: !!invoiceData.customer,
                        hasItem: !!invoiceData.item
                    });
                    toast.error('Data invoice tidak lengkap');
                    return false;
                }

                console.log('Starting PDF generation...');

                // Generate PDF using react-pdf
                const doc = React.createElement(InvoicePDF, { invoiceData });
                console.log('PDF document created, generating blob...');

                const pdfBlob = await pdf(doc).toBlob();
                console.log('PDF blob generated, size:', pdfBlob.size);

                if (pdfBlob.size === 0) {
                    toast.error('PDF generation failed - empty file');
                    return false;
                }

                // Create download link
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Invoice-${invoiceData.invoiceNumber}.pdf`;
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
            const errorMessage = extractErrorMessage(err, 'Gagal membuat PDF invoice');
            toast.error(errorMessage);
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

