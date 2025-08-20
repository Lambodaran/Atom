import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Search } from 'lucide-react';
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
        customerName: invoice.customer_name,
        profileName: invoice.profile_name,
        frequency: invoice.repeat_every,
        lastInvoiceDate: invoice.end_date || '',
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Recurring Invoices</h1>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search recurring invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={handleExport}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm w-full sm:w-auto"
            >
              Export
            </button>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-[#243158] text-white px-4 py-2 rounded text-sm flex items-center justify-center w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" /> Create Recurring Invoice
            </button>
          </div>
        </div>
        
        {/* Desktop Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden hidden md:block">
          <div className="grid grid-cols-7 bg-gray-100 p-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
            <div className="text-left">Customer</div>
            <div className="text-left">Profile</div>
            <div className="text-center">Frequency</div>
            <div className="text-center">Last Invoice</div>
            <div className="text-center">Next Invoice</div>
            <div className="text-center">Status</div>
            <div className="text-right">Amount</div>
          </div>
          
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="grid grid-cols-7 p-4 border-t border-gray-200 text-sm text-gray-800 hover:bg-gray-50 transition-colors">
                <div className="text-left font-medium truncate" title={invoice.customerName}>
                  {invoice.customerName}
                </div>
                <div className="text-left truncate" title={invoice.profileName}>
                  {invoice.profileName}
                </div>
                <div className="text-center">{invoice.frequency}</div>
                <div className="text-center">{formatDate(invoice.lastInvoiceDate)}</div>
                <div className="text-center font-medium text-blue-600">
                  {formatDate(invoice.nextInvoiceDate)}
                </div>
                <div className="text-center">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status] || 'bg-gray-100 text-gray-800'}`}>
                    {invoice.status}
                  </span>
                </div>
                <div className="text-right flex items-center justify-end">
                  <span className="font-medium">{invoice.amount}</span>
                  <button
                    onClick={() => handleDelete(invoice.id)}
                    className="text-gray-400 hover:text-red-600 ml-3"
                    title="Delete invoice"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No recurring invoices found
            </div>
          )}
        </div>
        
        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-900 truncate" title={invoice.customerName}>
                    {invoice.customerName}
                  </h3>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status] || 'bg-gray-100 text-gray-800'}`}>
                    {invoice.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Profile:</span>
                    <span className="font-medium">{invoice.profileName}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Frequency:</span>
                    <span>{invoice.frequency}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Invoice:</span>
                    <span>{formatDate(invoice.lastInvoiceDate)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Next Invoice:</span>
                    <span className="font-medium text-blue-600">{formatDate(invoice.nextInvoiceDate)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-gray-500">Amount:</span>
                    <div className="flex items-center">
                      <span className="font-medium mr-3">{invoice.amount}</span>
                      <button
                        onClick={() => handleDelete(invoice.id)}
                        className="text-gray-400 hover:text-red-600"
                        title="Delete invoice"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No recurring invoices found
            </div>
          )}
        </div>
        
        <div className="text-sm text-gray-500 mt-4 text-center">
          Showing {filteredInvoices.length} of {recurringInvoices.length} invoices
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