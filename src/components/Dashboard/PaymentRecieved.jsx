import React, { useState } from 'react';
import { Search, Calendar } from 'lucide-react';

const PaymentReceived = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customer, setCustomer] = useState('ALL');
  const [paymentMode, setPaymentMode] = useState('ALL');

  const payments = [
    {
      date: '13.05.2025',
      paymentNumber: '34',
      siteName: 'AL056 Sithalapakkam 2',
      customerName: 'Mr.Manivannan',
      invoiceNumber: 'INV1058',
      mode: 'CASH',
      amount: 'INR 1,286.00',
      unusedAmount: ''
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log({ startDate, endDate, customer, paymentMode });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-4">
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2">Export</button>
          <button className="bg-[#243158] text-white px-4 py-2 rounded">+ Add Payment Received</button>
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
                  className="pl-10 w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="pl-10 w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="DD-MM-YYYY"
                />
              </div>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <select
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">ALL</option>
                <option value="CASH">CASH</option>
                <option value="CHEQUE">CHEQUE</option>
                <option value="ONLINE">ONLINE</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="bg-[#243158] text-white py-2 px-4 rounded w-full md:w-auto"
            >
              <Search className="h-4 w-4 inline mr-2" />
              Search
            </button>
          </form>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-7 bg-gray-200 p-2 text-sm font-medium text-gray-700">
            <div className="p-2">DATE</div>
            <div className="p-2">PAYMENT NUMBER</div>
            <div className="p-2">SITE NAME</div>
            <div className="p-2">INVOICE NUMBER</div>
            <div className="p-2">MODE</div>
            <div className="p-2">AMOUNT</div>
            <div className="p-2">UNUSED AMOUNT</div>
          </div>
          {payments.map((payment, index) => (
            <div key={index} className="grid grid-cols-7 p-2 border-b border-gray-200 text-sm">
              <div className="p-2">{payment.date}</div>
              <div className="p-2">{payment.paymentNumber}</div>
              <div className="p-2">{payment.siteName}<br /><span className="text-xs text-gray-500">{payment.customerName}</span></div>
              <div className="p-2">{payment.invoiceNumber}</div>
              <div className="p-2">{payment.mode}</div>
              <div className="p-2">{payment.amount}</div>
              <div className="p-2">{payment.unusedAmount || '-'}</div>
            </div>
          ))}
        </div>
        
        <div className="text-sm text-gray-500 mt-4 text-center">
          Showing 1-1 of 1
        </div>
      </div>
    </div>
  );
};

export default PaymentReceived;