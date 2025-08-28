import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RecurringInvoiceForm = ({
  isOpen,
  onClose,
  onSuccess,
  isEdit = false,
  initialData = {},
}) => {
  const [formData, setFormData] = useState({
    customer: initialData.customerName || '',
    profile: initialData.profileName || '',
    frequency: initialData.frequency || '',
    amount: initialData.amount ? parseFloat(initialData.amount.replace('INR ', '')) : '',
    startDate: initialData.nextInvoiceDate ? new Date(initialData.nextInvoiceDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  });
  const [customers, setCustomers] = useState([]);
  // const [profiles, setProfiles] = useState([]); // Removed as profile will be typable
  const [loading, setLoading] = useState(false);

  const createAxiosInstance = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('Please log in to continue.');
      window.location.href = '/login';
      return null;
    }
    return axios.create({
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      // fetchProfiles(); // Removed as profile will be typable
      if (isEdit && initialData) {
        setFormData({
          customer: initialData.customerName || '',
          profile: initialData.profileName || '',
          frequency: initialData.frequency || '',
          amount: initialData.amount ? parseFloat(initialData.amount.replace('INR ', '')) : '',
          startDate: initialData.nextInvoiceDate ? new Date(initialData.nextInvoiceDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        });
      } else {
        setFormData({
          customer: '',
          profile: '',
          frequency: '',
          amount: '',
          startDate: new Date().toISOString().split('T')[0],
        });
      }
    }
  }, [isOpen, isEdit, initialData]);

  const fetchCustomers = async () => {
    const axiosInstance = createAxiosInstance();
    if (!axiosInstance) return;
    try {
      const response = await axiosInstance.get(`${import.meta.env.VITE_BASE_API}/sales/customer-list/`);
      setCustomers(response.data.map(c => ({ id: c.id, name: c.site_name })));
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const axiosInstance = createAxiosInstance();
    if (!axiosInstance) {
      setLoading(false);
      return;
    }

    const selectedCustomer = customers.find(c => c.name === formData.customer);

    if (!selectedCustomer || !formData.profile) { // Ensure profile is not empty
      toast.error('Please select a valid customer and provide a profile name.');
      setLoading(false);
      return;
    }

    // For profile, we will send the name directly. The backend should handle creating/linking.
    const payload = {
      customer_id: selectedCustomer.id,
      profile_name: formData.profile, // Send profile name directly
      repeat_every: formData.frequency,
      amount: parseFloat(formData.amount),
      start_date: formData.startDate,
    };

    try {
      if (isEdit) {
        await axiosInstance.put(`${import.meta.env.VITE_BASE_API}/sales/edit-recurring-invoice/${initialData.id}/`, payload);
        toast.success('Recurring invoice updated successfully!');
      } else {
        await axiosInstance.post(`${import.meta.env.VITE_BASE_API}/sales/add-recurring-invoice/`, payload);
        toast.success('Recurring invoice created successfully!');
      }
      onSuccess();
    } catch (error) {
      console.error('Error submitting recurring invoice:', error.response ? error.response.data : error);
      const errorMsg = error.response?.data?.non_field_errors?.[0] ||
                       Object.values(error.response?.data || {}).flat().join('; ') ||
                       `Failed to ${isEdit ? 'update' : 'create'} recurring invoice.`;
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#2D3A6B] to-[#243158] p-6">
          <h2 className="text-2xl font-bold text-white">
            {isEdit ? 'Edit Recurring Invoice' : 'Create New Recurring Invoice'}
          </h2>
          <p className="text-white">
            Fill in all required fields (*) to {isEdit ? 'update' : 'add'} a recurring invoice
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            {/* Customer */}
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer <span className="text-red-500">*</span>
              </label>
              <select
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#243158] focus:border-[#243158] transition-all duration-200 appearance-none bg-white"
                required
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.name}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Profile */}
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="profile"
                value={formData.profile}
                onChange={handleInputChange}
                className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#243158] focus:border-[#243158] transition-all duration-200"
                placeholder="Enter Profile Name"
                required
              />
            </div>

            {/* Frequency */}
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency <span className="text-red-500">*</span>
              </label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#243158] focus:border-[#243158] transition-all duration-200 appearance-none bg-white"
                required
              >
                <option value="">Select Frequency</option>
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

            {/* Amount */}
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#243158] focus:border-[#243158] transition-all duration-200"
                required
              />
            </div>

            {/* Start Date */}
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#243158] focus:border-[#243158] transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2.5 bg-gradient-to-r from-[#2D3A6B] to-[#243158] rounded-lg text-white font-medium transition-all duration-200 shadow-md ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-[#213066] hover:to-[#182755]'
              }`}
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Invoice' : 'Create Invoice')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecurringInvoiceForm;
