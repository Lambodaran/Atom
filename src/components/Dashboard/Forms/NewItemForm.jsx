import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const apiBaseUrl = import.meta.env.VITE_BASE_API;

const NewItemForm = ({ onCancel, onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    make: '',
    model: '',
    capacity: '',
    thresholdQty: '',
    salePrice: 0,
    type: '',
    unit: '',
    description: '',
    taxPreference: 'Taxable',
    serviceType: 'Goods',
    gst: '',
    partNo: '',
    sac: '',
    sacIgst: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [existingOptions, setExistingOptions] = useState({
    make: [],
    type: [],
  });
  const [modalState, setModalState] = useState({
    make: { isOpen: false, value: '', isEditing: false, editId: null },
    type: { isOpen: false, value: '', isEditing: false, editId: null },
  });

  const createAxiosInstance = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('Please log in to continue.');
      window.location.href = '/login';
      return null;
    }
    return axios.create({
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
  };

  const fetchOptions = async (field, retryCount = 2) => {
    const axiosInstance = createAxiosInstance();
    if (!axiosInstance) return;

    try {
      const endpoints = {
        make: 'makes',
        type: 'types',
      };
      const response = await axiosInstance.get(`${apiBaseUrl}/${endpoints[field]}/`);
      setExistingOptions((prev) => ({
        ...prev,
        [field]: response.data,
      }));
    } catch (error) {
      console.error(`Error fetching ${field}:`, error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      } else if (retryCount > 0 && error.code === 'ERR_NETWORK') {
        setTimeout(() => fetchOptions(field, retryCount - 1), 2000);
      } else {
        toast.error(`Failed to fetch ${field.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}.`);
      }
    }
  };

  useEffect(() => {
    const fields = ['make', 'type'];
    fields.forEach(field => fetchOptions(field));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const openAddModal = (field, isEditing = false, editId = null, editValue = '') => {
    setModalState((prev) => ({
      ...prev,
      [field]: { isOpen: true, value: editValue, isEditing, editId },
    }));
  };

  const closeAddModal = (field) => {
    setModalState((prev) => ({
      ...prev,
      [field]: { isOpen: false, value: '', isEditing: false, editId: null },
    }));
  };

  const handleAddOption = async (field) => {
    const value = modalState[field].value.trim();
    if (!value) {
      toast.error(`Please enter a ${field.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}.`);
      return;
    }

    const axiosInstance = createAxiosInstance();
    if (!axiosInstance) return;

    try {
      const apiEndpoints = {
        make: 'edit-make',
        type: 'edit-type',
      };
      const addEndpoints = {
        make: 'add-make',
        type: 'add-type',
      };
      const isEditing = modalState[field].isEditing;
      const editId = modalState[field].editId;

      if (isEditing) {
        await axiosInstance.put(`${apiBaseUrl}/${apiEndpoints[field]}/${editId}/`, { value });
        toast.success(`${field.replace(/([A-Z])/g, ' $1').trim()} updated successfully.`);
      } else {
        await axiosInstance.post(`${apiBaseUrl}/${addEndpoints[field]}/`, { value });
        setFormData((prev) => ({ ...prev, [field]: value }));
        toast.success(`${field.replace(/([A-Z])/g, ' $1').trim()} added successfully.`);
      }

      fetchOptions(field);
      closeAddModal(field);
    } catch (error) {
      console.error(`Error ${isEditing ? 'editing' : 'adding'} ${field}:`, error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      } else {
        toast.error(error.response?.data?.value?.[0] || `Failed to ${isEditing ? 'update' : 'add'} ${field.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}.`);
      }
    }
  };

  const handleDeleteOption = async (field, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${field.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}?`)) return;

    const axiosInstance = createAxiosInstance();
    if (!axiosInstance) return;

    try {
      const deleteEndpoints = {
        make: 'delete-make',
        type: 'delete-type',
      };
      await axiosInstance.delete(`${apiBaseUrl}/${deleteEndpoints[field]}/${id}/`);
      toast.success(`${field.replace(/([A-Z])/g, ' $1').trim()} deleted successfully.`);
      fetchOptions(field);
    } catch (error) {
      console.error(`Error deleting ${field}:`, error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      } else {
        toast.error(error.response?.data?.error || `Failed to delete ${field.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}.`);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.salePrice < 0) newErrors.salePrice = 'Sale Price cannot be negative';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const itemData = {
        name: formData.name,
        make: formData.make,
        model: formData.model,
        capacity: formData.capacity,
        thresholdQty: formData.thresholdQty,
        salePrice: formData.salePrice,
        type: formData.type,
        unit: formData.unit,
        description: formData.description,
        taxPreference: formData.taxPreference,
        serviceType: formData.serviceType,
        gst: formData.gst,
        partNo: formData.partNo,
        sac: formData.sac,
        sacIgst: formData.sacIgst,
      };

      const response = await axios.post(`${apiBaseUrl}/add_item/`, itemData, { withCredentials: true });
      toast.success(response.data.message || 'Item created successfully.');
      if (onSubmit) onSubmit(itemData);
      else navigate('/items');
    } catch (error) {
      console.error('Error creating item:', error.response?.data || error);
      toast.error(error.response?.data?.error || 'Failed to create item.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      make: '',
      model: '',
      capacity: '',
      thresholdQty: '',
      salePrice: 0,
      type: '',
      unit: '',
      description: '',
      taxPreference: 'Taxable',
      serviceType: 'Goods',
      gst: '',
      partNo: '',
      sac: '',
      sacIgst: '',
    });
    setErrors({});
    if (onCancel) onCancel();
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#2D3A6B] to-[#243158] p-6">
          <h2 className="text-2xl font-bold text-white">Create New Item</h2>
          <p className="text-white">Fill in all required fields (*) to add an item</p>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Essential Information</h3>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  required
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                <div className="flex">
                  <select
                    name="make"
                    value={formData.make}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2.5 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 appearance-none bg-white"
                  >
                    <option value="">Select Make</option>
                    {existingOptions.make.map((option) => (
                      <option key={option.id} value={option.value}>{option.value}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => openAddModal('make')}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 px-3 rounded-r-lg border border-l-0 border-gray-300 hover:from-blue-600 hover:to-blue-700 transition-all text-white"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="text"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Threshold Qty</label>
                <input
                  type="text"
                  name="thresholdQty"
                  value={formData.thresholdQty}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Pricing & Details</h3>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleInputChange}
                    className="block w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    step="0.01"
                  />
                  {errors.salePrice && <p className="text-red-500 text-sm mt-1">{errors.salePrice}</p>}
                </div>
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <div className="flex">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2.5 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 appearance-none bg-white"
                  >
                    <option value="">Select Type</option>
                    {existingOptions.type.map((option) => (
                      <option key={option.id} value={option.value}>{option.value}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => openAddModal('type')}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 px-3 rounded-r-lg border border-l-0 border-gray-300 hover:from-blue-600 hover:to-blue-700 transition-all text-white"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Preference</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="taxPreference"
                      value="Taxable"
                      checked={formData.taxPreference === 'Taxable'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Taxable
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="taxPreference"
                      value="Non-Taxable"
                      checked={formData.taxPreference === 'Non-Taxable'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Non-Taxable
                  </label>
                </div>
                {formData.taxPreference === 'Taxable' && (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">SAC</label>
                    <input
                      type="text"
                      name="sac"
                      value={formData.sac}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    />
                    <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">IGST</label>
                    <input
                      type="text"
                      name="sacIgst"
                      value={formData.sacIgst}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    />
                  </>
                )}
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="serviceType"
                      value="Goods"
                      checked={formData.serviceType === 'Goods'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Goods
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="serviceType"
                      value="Services"
                      checked={formData.serviceType === 'Services'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Services
                  </label>
                </div>
                {formData.serviceType === 'Goods' && (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">GST</label>
                    <input
                      type="text"
                      name="gst"
                      value={formData.gst}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    />
                    <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">Part No</label>
                    <input
                      type="text"
                      name="partNo"
                      value={formData.partNo}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    />
                  </>
                )}
                {formData.serviceType === 'Services' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">SAC Code</label>
                    <input
                      type="text"
                      name="sac"
                      value={formData.sac}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-[#2D3A6B] to-[#243158] rounded-lg text-white font-medium hover:from-[#213066] hover:to-[#182755] transition-all duration-200 shadow-md"
          >
            {loading ? 'Saving...' : 'Create Item'}
          </button>
        </div>
      </div>

      {Object.entries(modalState).map(([field, { isOpen, value, isEditing, editId }]) => (
        isOpen && (
          <div key={field} className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {isEditing ? `Edit ${field.replace(/([A-Z])/g, ' $1').trim()}` : `Add New ${field.replace(/([A-Z])/g, ' $1').trim()}`}
              </h3>
              <input
                type="text"
                value={value}
                onChange={(e) => setModalState((prev) => ({
                  ...prev,
                  [field]: { ...prev[field], value: e.target.value },
                }))}
                className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 mb-4"
                placeholder={`Enter new ${field.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}`}
              />
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Existing {field.replace(/([A-Z])/g, ' $1').trim()}s</h4>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {existingOptions[field].length > 0 ? (
                        existingOptions[field].map((option) => (
                          <tr key={option.id} className="border-t">
                            <td className="p-2">{option.value}</td>
                            <td className="p-2 text-right">
                              <button
                                onClick={() => openAddModal(field, true, option.id, option.value)}
                                className="text-blue-500 hover:text-blue-700 mr-2"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteOption(field, option.id)}
                                className="text-red-500 hover:text-red-700"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="p-2 text-center text-gray-500">
                            No {field.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}s found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => closeAddModal(field)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddOption(field)}
                  disabled={!value.trim()}
                  className={`px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white font-medium transition-all duration-200 ${!value.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-600 hover:to-blue-700'}`}
                >
                  {isEditing ? `Update ${field.replace(/([A-Z])/g, ' $1').trim()}` : `Add ${field.replace(/([A-Z])/g, ' $1').trim()}`}
                </button>
              </div>
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default NewItemForm;