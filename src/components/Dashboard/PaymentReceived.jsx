import React, { useState, useEffect } from 'react';
import { Search, Calendar } from 'lucide-react';
import PaymentReceivedForm from '../Dashboard/Forms/PaymentReceivedForm';
import axios from 'axios';

const PaymentReceived = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customer, setCustomer] = useState('ALL');
  const [paymentMode, setPaymentMode] = useState('ALL');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [payments, setPayments] = useState([]);

  // Centralized Axios instance with Bearer token
  const createAxiosInstance = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Authentication token not found');
      return null;
    }
    return axios.create({
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  // Fetch payment data
  const fetchPayments = async (retryCount = 2) => {
    const axiosInstance = createAxiosInstance();
    if (!axiosInstance) return;

    try {
      const response = await axiosInstance.get(`${import.meta.env.VITE_BASE_API}/sales/payment-received-list/`);
      if (!response.data) throw new Error('No data received');
      setPayments(response.data.map(payment => ({
        date: payment.date,
        paymentNumber: payment.payment_number,
        siteName: '', // Not in response, default to empty
        customerName: payment.customer_name,
        invoiceNumber: payment.invoice_reference || '', // Fallback if null
        mode: payment.payment_type,
        amount: `INR ${parseFloat(payment.amount).toFixed(2)}`,
        unusedAmount: '' // Not in response, default to empty
      })));
    } catch (error) {
      console.error('Error fetching payments:', error);
      if (error.response?.status === 401) {
        console.error('Session expired. Please log in again.');
      } else if (retryCount > 0 && error.code === 'ERR_NETWORK') {
        console.log(`Retrying fetch for payments... (${retryCount} attempts left)`);
        setTimeout(() => fetchPayments(retryCount - 1), 2000);
      } else {
        console.error(`Failed to fetch payments.`);
      }
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log({ startDate, endDate, customer, paymentMode });
  };

  const handlePaymentAdded = (newPayment) => {
    setPayments((prev) => [...prev, {
      date: newPayment.date,
      paymentNumber: newPayment.paymentNumber,
      siteName: newPayment.siteName || '',
      customerName: newPayment.customerName,
      invoiceNumber: newPayment.invoiceNumber || '',
      mode: newPayment.mode,
      amount: `INR ${parseFloat(newPayment.amount).toFixed(2)}`,
      unusedAmount: newPayment.unusedAmount || ''
    }]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Payment Received</h1>
        <div className="flex justify-end mb-6">
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2">Export</button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-[#243158] text-white px-4 py-2 rounded"
          >
            + Add Payment Received
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10 w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="DD-MM-YYYY"
                />
              </div>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10 w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="DD-MM-YYYY"
                />
              </div>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <select
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="ALL">ALL</option>
                <option value="Customer1">Customer 1</option>
                <option value="Customer2">Customer 2</option>
              </select>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="ALL">ALL</option>
                <option value="CASH">CASH</option>
                <option value="CHEQUE">CHEQUE</option>
                <option value="ONLINE">ONLINE</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="bg-[#243158] text-white py-2 px-4 rounded w-full md:w-auto text-sm font-medium"
            >
              <Search className="h-4 w-4 inline mr-2" />
              Search
            </button>
          </form>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-7 bg-gray-200 p-3 text-sm font-semibold text-gray-700 border-b border-gray-300">
            <div className="p-3 text-center">DATE</div>
            <div className="p-3 text-center">PAYMENT NUMBER</div>
            <div className="p-3 text-left">SITE NAME</div>
            <div className="p-3 text-center">INVOICE NUMBER</div>
            <div className="p-3 text-center">MODE</div>
            <div className="p-3 text-right">AMOUNT</div>
            <div className="p-3 text-right">UNUSED AMOUNT</div>
          </div>
          {payments.map((payment, index) => (
            <div key={index} className="grid grid-cols-7 p-3 border-b border-gray-200 text-sm text-gray-800 hover:bg-gray-50 transition-colors">
              <div className="p-3 text-center">{payment.date}</div>
              <div className="p-3 text-center">{payment.paymentNumber}</div>
              <div className="p-3 text-left flex flex-col">
                {payment.siteName}
                <span className="text-xs text-gray-500">{payment.customerName}</span>
              </div>
              <div className="p-3 text-center">{payment.invoiceNumber}</div>
              <div className="p-3 text-center">{payment.mode}</div>
              <div className="p-3 text-right">{payment.amount}</div>
              <div className="p-3 text-right">{payment.unusedAmount || '-'}</div>
            </div>
          ))}
        </div>
        
        <div className="text-sm text-gray-500 mt-4 text-center">
          Showing 1-{payments.length} of {payments.length}
        </div>

        <PaymentReceivedForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onPaymentAdded={handlePaymentAdded}
        />
      </div>
    </div>
  );
};

export default PaymentReceived;