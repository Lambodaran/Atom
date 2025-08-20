import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const RecurringInvoiceForm = ({ isOpen, onClose, onInvoiceAdded, isEdit = false, initialData = {} }) => {
  const [formData, setFormData] = useState({
    customer: '',
    profileName: '',
    frequency: 'week',
    startDate: '',
    endDate: '',
    status: 'active',
    item: '', // Single item field instead of items array
    rate: '',
    qty: 1,
    tax: 0.00,
    ...initialData,
  });
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Centralized Axios instance with Bearer token
  const createAxiosInstance = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Authentication token not found');
      return null;
    }
    return axios.create({
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  // Fetch customer and item data
  const fetchData = async (endpoint, setter, retryCount = 2) => {
    const axiosInstance = createAxiosInstance();
    if (!axiosInstance) return;

    try {
      const response = await axiosInstance.get(`${import.meta.env.VITE_BASE_API}/${endpoint}/`);
      if (!response.data) throw new Error('No data received');
      setter(response.data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else if (retryCount > 0 && error.code === 'ERR_NETWORK') {
        console.log(`Retrying fetch for ${endpoint}... (${retryCount} attempts left)`);
        setTimeout(() => fetchData(endpoint, setter, retryCount - 1), 2000);
      } else {
        setError(`Failed to fetch ${endpoint.replace(/[-]/g, ' ').trim()}.`);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData('sales/customer-list', setCustomers);
      fetchData('auth/item-list', setItems); // Updated to match the provided endpoint
      if (isEdit && initialData.id) {
        fetchData(`sales/edit-recurring-invoice/${initialData.id}/`, (data) => {
          setFormData({
            customer: data.customer.id || '',
            profileName: data.profile_name || '',
            frequency: data.repeat_every || 'week',
            startDate: data.start_date || '',
            endDate: data.end_date || '',
            status: data.status || 'active',
            item: data.items.length > 0 ? data.items[0].item.id || '' : '', // Use first item's id
            rate: data.items.length > 0 ? data.items[0].rate || '' : '',
            qty: data.items.length > 0 ? data.items[0].qty || 1 : 1,
            tax: data.items.length > 0 ? data.items[0].tax || 0.00 : 0.00,
          });
        });
      }
    }
  }, [isOpen, isEdit, initialData.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.customer || !formData.startDate || !formData.item || !formData.rate) {
      setError('Customer, Start Date, Item, and Rate are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      const axiosInstance = createAxiosInstance();
      if (!axiosInstance) throw new Error('Authentication failed');

      const payload = {
        customer: formData.customer,
        profile_name: formData.profileName,
        repeat_every: formData.frequency,
        start_date: formData.startDate,
        end_date: formData.endDate,
        status: formData.status,
        items: [{
          item: formData.item,
          rate: parseFloat(formData.rate),
          qty: parseInt(formData.qty),
          tax: parseFloat(formData.tax),
        }],
      };

      const url = isEdit && initialData.id
        ? `${import.meta.env.VITE_BASE_API}/sales/edit-recurring-invoice/${initialData.id}/`
        : `${import.meta.env.VITE_BASE_API}/sales/add-recurring-invoice/`;
      const method = isEdit ? 'put' : 'post';

      const response = await axiosInstance[method](url, payload);

      if (!response.data || response.data.message !== 'Recurring Invoice added successfully!') {
        throw new Error(response.data?.error || 'Failed to save recurring invoice');
      }

      const result = response.data;
      // Safeguard to ensure onInvoiceAdded is a function
      if (typeof onInvoiceAdded === 'function') {
        onInvoiceAdded({
          ...result,
          customerName: result.reference_id || '',
          frequency: result.repeat_every,
          lastInvoiceDate: result.last_invoice_date || '',
          nextInvoiceDate: result.next_invoice_date || result.start_date,
          status: result.status.toUpperCase(),
          amount: result.items ? `INR ${parseFloat(result.items.reduce((sum, item) => sum + item.total, 0)).toFixed(2)}` : 'INR 0.00',
        });
      } else {
        console.warn('onInvoiceAdded is not a function. Please ensure it is passed correctly from the parent component.');
      }
      onClose();
      setFormData({
        customer: '',
        profileName: '',
        frequency: 'week',
        startDate: '',
        endDate: '',
        status: 'active',
        item: '',
        rate: '',
        qty: 1,
        tax: 0.00,
      });
    } catch (err) {
      setError(err.message || 'Failed to submit recurring invoice');
      console.error('Submission error:', err.response?.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Create Recurring Invoice</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="max-h-[60vh] overflow-y-auto pr-2">
            <div className="flex space-x-4 mb-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
                <select
                  name="customer"
                  value={formData.customer}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.billing_name} (ID: {customer.reference_id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Name *</label>
                <input
                  type="text"
                  name="profileName"
                  value={formData.profileName}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="flex space-x-4 mb-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Number</label>
                <input
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Repeat Every *</label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="week">Week</option>
                  <option value="2week">2 Weeks</option>
                  <option value="month">Month</option>
                  <option value="2month">2 Months</option>
                  <option value="3month">3 Months</option>
                  <option value="6month">6 Months</option>
                  <option value="year">Year</option>
                  <option value="2year">2 Years</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4 mb-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Invoice Date </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Invoice Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="flex space-x-4 mb-4">
              {/* <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Sale Person</label>
                <select
                  name="salePerson"
                  value={formData.salePerson}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Select Sales Person</option>
                 
                </select>
              </div> */}
              {/* <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">GST Treatment</label>
                <select
                  name="gstTreatment"
                  value={formData.gstTreatment}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Select GST Treatment</option>
                
                </select>
              </div> */}
            </div>

            <div className="flex space-x-4 mb-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Billing Address</label>
                <textarea
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows="4"
                >
                  12.9970608 80.220687, Tamil Nadu
                </textarea>
                <button
                  type="button"
                  onClick={() => {/* Handle change */}}
                  className="text-blue-500 text-sm mt-1"
                >
                  Change
                </button>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                <textarea
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows="4"
                >
                  12.9970608 80.220687, Tamil Nadu
                </textarea>
                <button
                  type="button"
                  onClick={() => {/* Handle change */}}
                  className="text-blue-500 text-sm mt-1"
                >
                  Change
                </button>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-700">
                <div>Item</div>
                <div>Rate</div>
                <div>Qty</div>
                <div>Tax</div>
                <div>Total</div>
              </div>
              <div className="grid grid-cols-5 gap-4 mt-2">
                <select
                  name="item"
                  value={formData.item}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select Item</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="rate"
                  value={formData.rate}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  step="0.01"
                  required
                />
                <input
                  type="number"
                  name="qty"
                  value={formData.qty}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  min="1"
                />
                <input
                  type="number"
                  name="tax"
                  value={formData.tax}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  step="0.01"
                />
                <div className="flex items-center">
                  <span className="text-sm">0.00</span>
                  <button
                    type="button"
                    onClick={() => {/* Handle add item */}}
                    className="ml-2 text-blue-500"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Uploads File(s) (Max File Size Allowed 1MB)</label>
              <input
                type="file"
                name="uploads"
                onChange={handleChange}
                className="w-full rounded-md border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-[#243158] text-white px-4 py-2 rounded text-sm ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : isEdit ? 'Update Invoice' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecurringInvoiceForm;
