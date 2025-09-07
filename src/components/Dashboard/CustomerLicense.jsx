import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CustomerLicense = () => {
  const [data, setData] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL'
  });

  const apiBaseUrl = import.meta.env.VITE_BASE_API || '';

  const createAxiosInstance = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found in localStorage');
      toast.error('Please log in to continue.');
      window.location.href = '/login';
      return null;
    }
    return axios.create({
      baseURL: apiBaseUrl,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const fetchLicenses = async () => {
    const axiosInstance = createAxiosInstance();
    if (!axiosInstance) return;

    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/sales/customer-license-list/');
      console.log('API Response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setData(response.data.map(item => ({
          site: item.customer_name || 'N/A',
          lift: item.lift_details || null,   // keep full lift object
          licenseNo: item.license_no || 'N/A',
           period: `${item.period_start || 'N/A'} to ${item.handover_date || item.period_end || 'N/A'}`,  // ✅ handover replaces end date
          attachment: item.attachment ? 'View' : '',
          attachmentUrl: item.attachment
        })));
      } else {
        console.error('Invalid response format:', response.data);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching customer licenses:', error.response ? error.response.data : error.message);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      } else {
        toast.error('Failed to fetch customer licenses. Check console for details.');
      }
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const toggleExpand = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const handleSearch = () => {
    fetchLicenses();
  };

  const handleExport = async () => {
    try {
      const axiosInstance = createAxiosInstance();
      if (!axiosInstance) return;
      
      const response = await axiosInstance.get('/sales/export-customer-licenses/', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'customer_licenses.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Licenses exported successfully');
    } catch (error) {
      console.error('Error exporting licenses:', error);
      toast.error('Failed to export licenses');
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading customer licenses...</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-col md:flex-row">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 md:mb-0">Customer License</h2>
      </div>
      
      {/* Filters */}
      {/* (keep your filters unchanged) */}

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-xl shadow-2xl">
          <thead>
            <tr className="bg-gray-300 text-gray-800 rounded-t-xl">
              <th className="p-4 text-left font-semibold">SITE NAME</th>
              <th className="p-4 text-left font-semibold">LIFT DETAILS</th>
              <th className="p-4 text-left font-semibold">LICENSE NO</th>
              <th className="p-4 text-left font-semibold">PERIOD</th>
              <th className="p-4 text-left font-semibold">ATTACHMENT</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition duration-300">
                  <td className="p-4">{item.site}</td>

                  {/* ✅ Clean lift details */}
                  <td className="p-4 text-sm text-gray-700">
                    {item.lift ? (
                      <div className="space-y-1">
                        <p><strong>ID:</strong> {item.lift.id}</p>
                        <p><strong>Code:</strong> {item.lift.lift_code}</p>
                        <p><strong>Name:</strong> {item.lift.name}</p>
                        <p><strong>Floor:</strong> {item.lift.floor_id_value}</p>
                        <p><strong>Brand:</strong> {item.lift.brand_value}</p>
                        <p><strong>Model:</strong> {item.lift.model}</p>
                        <p><strong>Passengers:</strong> {item.lift.no_of_passengers}</p>
                        <p><strong>Load:</strong> {item.lift.load_kg} Kg</p>
                        <p><strong>Speed:</strong> {item.lift.speed}</p>
                        <p><strong>Lift Type:</strong> {item.lift.lift_type_value}</p>
                        <p><strong>Machine Type:</strong> {item.lift.machine_type_value}</p>
                        <p><strong>Machine Brand:</strong> {item.lift.machine_brand_value}</p>
                        <p><strong>Door Type:</strong> {item.lift.door_type_value}</p>
                        <p><strong>Door Brand:</strong> {item.lift.door_brand_value}</p>
                        <p><strong>Controller Brand:</strong> {item.lift.controller_brand_value}</p>
                        <p><strong>Cabin:</strong> {item.lift.cabin_value}</p>
                        <p><strong>Price:</strong> {item.lift.price}</p>
                      </div>
                    ) : (
                      "No lift details"
                    )}
                  </td>

                  <td className="p-4">{item.licenseNo}</td>
                  <td className="p-4">{item.period}</td>
                  <td className="p-4">
                    {item.attachmentUrl ? (
                      <a
                        href={`${apiBaseUrl}${item.attachmentUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {item.attachment}
                      </a>
                    ) : "No attachment"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                  No customer licenses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-lg p-4 border border-gray-200"
              onClick={() => toggleExpand(index)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">{item.site}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">License:</span> {item.licenseNo}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Period:</span> {item.period}
                  </p>
                </div>
              </div>
              
              {expandedCard === index && item.lift && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-1">Lift Details:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><strong>ID:</strong> {item.lift.id}</li>
                    <li><strong>Code:</strong> {item.lift.lift_code}</li>
                    <li><strong>Name:</strong> {item.lift.name}</li>
                    <li><strong>Floor:</strong> {item.lift.floor_id_value}</li>
                    <li><strong>Brand:</strong> {item.lift.brand_value}</li>
                    <li><strong>Model:</strong> {item.lift.model}</li>
                    <li><strong>Passengers:</strong> {item.lift.no_of_passengers}</li>
                    <li><strong>Load:</strong> {item.lift.load_kg} Kg</li>
                    <li><strong>Speed:</strong> {item.lift.speed}</li>
                    <li><strong>Lift Type:</strong> {item.lift.lift_type_value}</li>
                    <li><strong>Machine Type:</strong> {item.lift.machine_type_value}</li>
                    <li><strong>Machine Brand:</strong> {item.lift.machine_brand_value}</li>
                    <li><strong>Door Type:</strong> {item.lift.door_type_value}</li>
                    <li><strong>Door Brand:</strong> {item.lift.door_brand_value}</li>
                    <li><strong>Controller Brand:</strong> {item.lift.controller_brand_value}</li>
                    <li><strong>Cabin:</strong> {item.lift.cabin_value}</li>
                    <li><strong>Price:</strong> {item.lift.price}</li>
                  </ul>
                </div>
              )}
              
              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-center">
                <button 
                  className="text-orange-500 text-sm flex items-center"
                  onClick={() => toggleExpand(index)}
                >
                  {expandedCard === index ? 'Show Less' : 'Show More'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 p-4">
            No customer licenses found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerLicense;
