import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import RecurringInvoiceForm from '../Dashboard/Forms/RecurringInvoiceForm';
import axios from 'axios';

const RecurringInvoices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [recurringInvoices, setRecurringInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

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

  // Fetch recurring invoices
  const fetchRecurringInvoices = async (retryCount = 2) => {
    const axiosInstance = createAxiosInstance();
    if (!axiosInstance) return;

    try {
      const response = await axiosInstance.get(`${import.meta.env.VITE_BASE_API}/sales/recurring-invoice-list/`);
      if (!response.data) throw new Error('No data received');
      setRecurringInvoices(response.data.map(invoice => ({
        id: invoice.id,
        customerName: invoice.reference_id,
        profileName: invoice.profile_name,
        frequency: invoice.repeat_every,
        lastInvoiceDate: invoice.last_invoice_date || '',
        nextInvoiceDate: invoice.next_invoice_date || invoice.start_date,
        status: invoice.status.toUpperCase(),
        amount: `INR ${parseFloat(invoice.items.reduce((sum, item) => sum + item.total, 0)).toFixed(2)}`,
      })));
    } catch (error) {
      console.error('Error fetching recurring invoices:', error);
      if (error.response?.status === 401) {
        console.error('Session expired. Please log in again.');
      } else if (retryCount > 0 && error.code === 'ERR_NETWORK') {
        console.log(`Retrying fetch for recurring invoices... (${retryCount} attempts left)`);
        setTimeout(() => fetchRecurringInvoices(retryCount - 1), 2000);
      } else {
        console.error('Failed to fetch recurring invoices.');
      }
    }
  };

  useEffect(() => {
    fetchRecurringInvoices();
  }, []);

  const handleInvoiceAdded = (newInvoice) => {
    setRecurringInvoices((prev) => [...prev, newInvoice]);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recurring invoice?')) {
      const axiosInstance = createAxiosInstance();
      if (!axiosInstance) return;

      try {
        await axiosInstance.delete(`${import.meta.env.VITE_BASE_API}/sales/delete-recurring-invoice/${id}/`);
        setRecurringInvoices((prev) => prev.filter(invoice => invoice.id !== id));
      } catch (error) {
        console.error('Error deleting recurring invoice:', error);
        alert('Failed to delete recurring invoice.');
      }
    }
  };

  const handleExport = async () => {
    const axiosInstance = createAxiosInstance();
    if (!axiosInstance) return;

    try {
      const response = await axiosInstance.get(`${import.meta.env.VITE_BASE_API}/sales/export-recurring-invoices-to-excel/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `recurring_invoices_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting recurring invoices:', error);
      alert('Failed to export recurring invoices.');
    }
  };

  const filteredInvoices = recurringInvoices.filter(invoice =>
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.profileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-yellow-100 text-yellow-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  // Debugging: Log state changes
  useEffect(() => {
    console.log('isFormOpen changed to:', isFormOpen);
  }, [isFormOpen]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Recurring Invoices</h1>
        <div className="flex flex-col sm:flex-row justify-end mb-6 gap-2 sm:gap-4">
          <button
            onClick={handleExport}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded w-full sm:w-auto text-sm"
          >
            Export
          </button>
          <button
            onClick={() => {
              console.log('Create button clicked, setting isFormOpen to true');
              setIsFormOpen(true);
            }}
            className="bg-[#243158] text-white px-4 py-2 rounded w-full sm:w-auto text-sm"
          >
            <Plus className="h-4 w-4 mr-2 inline" /> Create Recurring Invoice
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search recurring invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-7 bg-gray-200 p-3 text-sm font-semibold text-gray-700 border-b border-gray-300 hidden sm:grid">
            <div className="p-3 text-left">Customer Name</div>
            <div className="p-3 text-left">Profile Name</div>
            <div className="p-3 text-center">Frequency</div>
            <div className="p-3 text-center">Last Invoice Date</div>
            <div className="p-3 text-center">Next Invoice Date</div>
            <div className="p-3 text-center">Status</div>
            <div className="p-3 text-right">Amount</div>
          </div>
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="sm:grid sm:grid-cols-7 p-2 sm:p-3 border-b border-gray-200 text-sm text-gray-800 hover:bg-gray-50 transition-colors">
              {/* Mobile View: Stacked Card Layout */}
              <div className="sm:hidden p-2 bg-gray-50 rounded mb-2">
                <div className="text-left font-medium"><strong>Customer Name:</strong> {invoice.customerName}</div>
                <div className="text-left"><strong>Profile Name:</strong> {invoice.profileName}</div>
                <div className="text-center"><strong>Frequency:</strong> {invoice.frequency}</div>
                <div className="text-center"><strong>Last Invoice:</strong> {invoice.lastInvoiceDate}</div>
                <div className="text-center"><strong>Next Invoice:</strong> {invoice.nextInvoiceDate}</div>
                <div className="text-center">
                  <strong>Status:</strong>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status] || 'bg-gray-100 text-gray-800'}`}>
                    {invoice.status}
                  </span>
                </div>
                <div className="text-right flex justify-between items-center mt-2">
                  <span className="font-medium"><strong>Amount:</strong> {invoice.amount}</span>
                  <button
                    onClick={() => handleDelete(invoice.id)}
                    className="text-gray-400 hover:text-red-600 text-sm"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {/* Desktop View: Grid Layout */}
              <div className="hidden sm:block p-3 text-left font-medium">{invoice.customerName}</div>
              <div className="hidden sm:block p-3 text-left">{invoice.profileName}</div>
              <div className="hidden sm:block p-3 text-center">{invoice.frequency}</div>
              <div className="hidden sm:block p-3 text-center">{invoice.lastInvoiceDate}</div>
              <div className="hidden sm:block p-3 text-center">{invoice.nextInvoiceDate}</div>
              <div className="hidden sm:block p-3 text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status] || 'bg-gray-100 text-gray-800'}`}>
                  {invoice.status}
                </span>
              </div>
              <div className="hidden sm:block p-3 text-right flex items-center justify-end">
                <span className="font-medium">{invoice.amount}</span>
                <button
                  onClick={() => handleDelete(invoice.id)}
                  className="text-gray-400 hover:text-red-600 text-sm ml-2"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-sm text-gray-500 mt-4 text-center">
          Showing 1-{filteredInvoices.length} of {recurringInvoices.length}
        </div>

        <RecurringInvoiceForm
          isOpen={isFormOpen}
          onClose={() => { setIsFormOpen(false); setSelectedInvoice(null); }}
          onPaymentAdded={handleInvoiceAdded}
          isEdit={!!selectedInvoice}
          initialData={selectedInvoice || {}}
        />
      </div>
    </div>
  );
};

export default RecurringInvoices;