import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LiftForm from '../components/Forms/LiftForm';
import { Edit,Pencil, Trash2,RefreshCw,Search } from 'lucide-react';

const apiBaseUrl = import.meta.env.VITE_BASE_API;

const Lifts = () => {
  // State for lifts data and loading status
  const [lifts, setLifts] = useState([]);
  const [loading, setLoading] = useState(false);

  // State for filters
  const [filters, setFilters] = useState({
    doorType: 'ALL',
    liftType: 'ALL',
    machineType: 'ALL',
    floorID: 'ALL',
    brand: 'ALL',
    load: 'ALL',
    noOfPassengers: 'ALL',
    model: 'ALL',
  });

  // State for dropdown options
  const [brandOptions, setBrandOptions] = useState([]);
  const [floorOptions, setFloorOptions] = useState([]);
  const [machineTypeOptions, setMachineTypeOptions] = useState([]);
  const [liftTypeOptions, setLiftTypeOptions] = useState([]);
  const [doorTypeOptions, setDoorTypeOptions] = useState([]);
  const [machineBrandOptions, setMachineBrandOptions] = useState([]);
  const [doorBrandOptions, setDoorBrandOptions] = useState([]);
  const [controllerBrandOptions, setControllerBrandOptions] = useState([]);
  const [cabinOptions, setCabinOptions] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);

  // State for modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentLift, setCurrentLift] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Fetch data with retry logic
  const fetchData = async (retryCount = 3) => {
    setLoading(true);
    try {
      // Fetch lifts data
      const liftsResponse = await axios.get(`${apiBaseUrl}/lift_list/`, { 
        withCredentials: true 
      });
      
      const liftsData = liftsResponse.data.map(lift => ({
        id: lift.id,
        liftCode: lift.lift_code,
        noOfPassengers: lift.no_of_passengers,
        brand: lift.brand_value,
        load: lift.load_kg,
        liftType: lift.lift_type_value,
        machineType: lift.machine_type_value,
        doorType: lift.door_type_value,
        floorID: lift.floor_id_value,
        model: lift.model || 'Standard',
        name: lift.name,
        speed: lift.speed,
        machineBrand: lift.machine_brand_value,
        doorBrand: lift.door_brand_value,
        controllerBrand: lift.controller_brand_value,
        cabin: lift.cabin_value,
        price: lift.price,
      }));

      setLifts(liftsData);

      // Derive model options from lifts data
      const uniqueModels = [...new Set(liftsData.map(lift => lift.model).filter(model => model))];
      setModelOptions(uniqueModels);

      // Fetch all dropdown options in parallel
      const [
        brands, 
        floors, 
        machineTypes, 
        liftTypes, 
        doorTypes, 
        machineBrands, 
        doorBrands, 
        controllerBrands, 
        cabins
      ] = await Promise.all([
        axios.get(`${apiBaseUrl}/brands/`, { withCredentials: true }),
        axios.get(`${apiBaseUrl}/floor-ids/`, { withCredentials: true }),
        axios.get(`${apiBaseUrl}/machine-types/`, { withCredentials: true }),
        axios.get(`${apiBaseUrl}/lift-types/`, { withCredentials: true }),
        axios.get(`${apiBaseUrl}/door-types/`, { withCredentials: true }),
        axios.get(`${apiBaseUrl}/machine-brands/`, { withCredentials: true }),
        axios.get(`${apiBaseUrl}/door-brands/`, { withCredentials: true }),
        axios.get(`${apiBaseUrl}/controller-brands/`, { withCredentials: true }),
        axios.get(`${apiBaseUrl}/cabins/`, { withCredentials: true }),
      ]);

      // Set dropdown options
      setBrandOptions(brands.data.map(item => item.value));
      setFloorOptions(floors.data.map(item => item.value));
      setMachineTypeOptions(machineTypes.data.map(item => item.value));
      setLiftTypeOptions(liftTypes.data.map(item => item.value));
      setDoorTypeOptions(doorTypes.data.map(item => item.value));
      setMachineBrandOptions(machineBrands.data.map(item => item.value));
      setDoorBrandOptions(doorBrands.data.map(item => item.value));
      setControllerBrandOptions(controllerBrands.data.map(item => item.value));
      setCabinOptions(cabins.data.map(item => item.value));

    } catch (error) {
      console.error('Error fetching data:', error);
      if (retryCount > 0) {
        console.log(`Retrying fetchData... (${retryCount} attempts left)`);
        setTimeout(() => fetchData(retryCount - 1), 1000);
      } else {
        toast.error(error.response?.data?.error || 'Failed to fetch lift data.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      doorType: 'ALL',
      liftType: 'ALL',
      machineType: 'ALL',
      floorID: 'ALL',
      brand: 'ALL',
      load: 'ALL',
      noOfPassengers: 'ALL',
      model: 'ALL',
    });
    setCurrentPage(1);
  };

  // Handle lift deletion
  const handleDeleteLift = async (id) => {
    if (window.confirm('Are you sure you want to delete this lift?')) {
      try {
        await axios.delete(`${apiBaseUrl}/delete_lift/${id}/`, { 
          withCredentials: true 
        });
        setLifts(prev => prev.filter(lift => lift.id !== id));
        setCurrentPage(1); // Reset to first page after deletion
        toast.success('Lift deleted successfully.');
      } catch (error) {
        console.error('Error deleting lift:', error.response?.data || error);
        toast.error(error.response?.data?.error || 'Failed to delete lift.');
      }
    }
  };

  // Open edit modal with lift data
  const openEditModal = (lift) => {
    setCurrentLift({
      ...lift,
      noOfPassengers: lift.noOfPassengers.replace(' Persons', ''),
    });
    setIsEditModalOpen(true);
  };

  // Filter lifts based on current filters
  const filteredLifts = lifts.filter(lift => 
    Object.entries(filters).every(([key, value]) => {
      if (value === 'ALL') return true;
      if (key === 'load') return lift[key].toString() === value;
      if (key === 'noOfPassengers') return lift[key] === value;
      return lift[key] === value;
    })
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLifts = filteredLifts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLifts.length / itemsPerPage);

  return (
     <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header and Actions */}
     <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row justify-between items-start md:items-center mb-4 md:mb-6">
  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Lifts Management</h1>
  
  <div className="flex items-center space-x-2 w-full md:w-auto">
    {/* Bulk Actions Dropdown - UI only */}
    <div className="relative">
      <button
        className="flex items-center justify-center bg-gray-200 text-gray-700 px-3 md:px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200 text-sm md:text-base"
        onClick={() => {}}
      >
        Bulk Actions
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>

    {/* Three Dot Menu Button - UI only */}
    <div className="relative">
      <button
        className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        onClick={() => {}}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    </div>

    {/* Create New Lift Button - functional */}
    <button
      onClick={() => setIsCreateModalOpen(true)}
      className="bg-orange-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-200 text-sm md:text-base"
    >
      Create New Lift
    </button>
  </div>
</div>

     {/* Filters Section - Fully Responsive */}
<div className="bg-white p-3 md:p-4 rounded-lg shadow-lg mb-4 md:mb-6">
  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-9 gap-3 md:gap-4 items-end">
    {/* Door Type */}
    <div className="xl:col-span-1">
      <select 
        name="doorType" 
        value={filters.doorType} 
        onChange={handleFilterChange}
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm md:text-base"
      >
        <option value="ALL">All Door Types</option>
        {doorTypeOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>

    {/* Lift Type */}
    <div className="xl:col-span-1">
      <select 
        name="liftType" 
        value={filters.liftType} 
        onChange={handleFilterChange}
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm md:text-base"
      >
        <option value="ALL">All Lift Types</option>
        {liftTypeOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>

    {/* Machine Type */}
    <div className="xl:col-span-1">
      <select 
        name="machineType" 
        value={filters.machineType} 
        onChange={handleFilterChange}
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm md:text-base"
      >
        <option value="ALL">All Machine Types</option>
        {machineTypeOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>

    {/* Floor */}
    <div className="xl:col-span-1">
      <select 
        name="floorID" 
        value={filters.floorID} 
        onChange={handleFilterChange}
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm md:text-base"
      >
        <option value="ALL">All Floors</option>
        {floorOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>

    {/* Brand */}
    <div className="xl:col-span-1">
      <select 
        name="brand" 
        value={filters.brand} 
        onChange={handleFilterChange}
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm md:text-base"
      >
        <option value="ALL">All Brands</option>
        {brandOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>

    {/* Load */}
    <div className="xl:col-span-1">
      <select 
        name="load" 
        value={filters.load} 
        onChange={handleFilterChange}
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm md:text-base"
      >
        <option value="ALL">All Loads</option>
        {[...new Set(lifts.map(lift => lift.load.toString()))].map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>

    {/* Passengers */}
    <div className="xl:col-span-1">
      <select 
        name="noOfPassengers" 
        value={filters.noOfPassengers} 
        onChange={handleFilterChange}
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm md:text-base"
      >
        <option value="ALL">All Passengers</option>
        {[...new Set(lifts.map(lift => lift.noOfPassengers))].map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>

    {/* Model */}
    <div className="xl:col-span-1">
      <select 
        name="model" 
        value={filters.model} 
        onChange={handleFilterChange}
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm md:text-base"
      >
        <option value="ALL">All Models</option>
        {modelOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>

    {/* Filter Actions - Responsive column span */}
    <div className="flex flex-row space-x-2 col-span-1 xs:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-1 2xl:col-span-1">
      <button
        onClick={resetFilters}
        className="flex-1 bg-gray-200 text-gray-700 px-3 md:px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200 text-sm md:text-base"
      >
        Reset
      </button>
      <button
        onClick={() => setCurrentPage(1)}
        className="flex-1 bg-orange-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-200 text-sm md:text-base flex items-center justify-center"
      >
        <Search className="w-4 h-4 mr-1" />
        <span>Search</span>
      </button>
    </div>
  </div>
</div>

      {/* Tablet and Desktop View (768px and above) */}
      <div className="hidden md:block bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[768px]">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                <th className="p-3 lg:p-4 text-left">ID</th>
                <th className="p-3 lg:p-4 text-left">Lift Code</th>
                <th className="p-3 lg:p-4 text-left">Passengers</th>
                <th className="p-3 lg:p-4 text-left">Brand</th>
                <th className="p-3 lg:p-4 text-left">Load</th>
                <th className="p-3 lg:p-4 text-left hidden lg:table-cell">Lift Type</th>
                <th className="p-3 lg:p-4 text-left hidden lg:table-cell">Machine Type</th>
                <th className="p-3 lg:p-4 text-left hidden xl:table-cell">Door Type</th>
                <th className="p-3 lg:p-4 text-left">Floor</th>
                <th className="p-3 lg:p-4 text-left">Model</th>
                <th className="p-3 lg:p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="11" className="text-center p-4">
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                  </td>
                </tr>
              ) : currentLifts.length > 0 ? (
                currentLifts.map(lift => (
                  <tr key={lift.id} className="border-t hover:bg-gray-50 transition duration-200">
                    <td className="p-3 lg:p-4 text-gray-800">{lift.id}</td>
                    <td className="p-3 lg:p-4 text-gray-800 font-medium whitespace-nowrap">{lift.liftCode}</td>
                    <td className="p-3 lg:p-4 text-gray-800 whitespace-nowrap">{lift.noOfPassengers}</td>
                    <td className="p-3 lg:p-4 text-gray-800 whitespace-nowrap">{lift.brand || '-'}</td>
                    <td className="p-3 lg:p-4 text-gray-800 whitespace-nowrap">{lift.load}</td>
                    <td className="p-3 lg:p-4 text-gray-800 hidden lg:table-cell whitespace-nowrap">{lift.liftType || '-'}</td>
                    <td className="p-3 lg:p-4 text-gray-800 hidden lg:table-cell whitespace-nowrap">{lift.machineType || '-'}</td>
                    <td className="p-3 lg:p-4 text-gray-800 hidden xl:table-cell whitespace-nowrap">{lift.doorType || '-'}</td>
                    <td className="p-3 lg:p-4 text-gray-800 whitespace-nowrap">{lift.floorID || '-'}</td>
                    <td className="p-3 lg:p-4 text-gray-800 whitespace-nowrap">{lift.model}</td>
                    <td className="p-3 lg:p-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(lift)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteLift(lift.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center p-4 text-gray-500">
                    No lifts found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3 md:p-4 text-gray-600 flex flex-col md:flex-row justify-between items-center border-t">
          <span className="text-sm md:text-base mb-2 md:mb-0">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredLifts.length)} of {filteredLifts.length}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 md:px-4 py-1 md:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition duration-200 text-sm md:text-base"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 md:px-4 py-1 md:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition duration-200 text-sm md:text-base"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Mobile View (below 768px) - Attractive Cards */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="flex justify-center items-center py-8 bg-white rounded-lg shadow">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : currentLifts.length > 0 ? (
          currentLifts.map(lift => (
            <div key={lift.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-lg truncate">{lift.liftCode}</h3>
                  <p className="text-sm text-gray-600 truncate">
                    {lift.brand} {lift.model && `• ${lift.model}`}
                  </p>
                </div>
                <div className="flex space-x-2 ml-2">
                  <button
                    onClick={() => openEditModal(lift)}
                    className="text-blue-500 hover:text-blue-700 p-1"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteLift(lift.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500 block text-xs">Passengers</span>
                  <span className="font-medium">{lift.noOfPassengers}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500 block text-xs">Load</span>
                  <span className="font-medium">{lift.load} kg</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500 block text-xs">Floor</span>
                  <span className="font-medium">{lift.floorID || '-'}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500 block text-xs">Type</span>
                  <span className="font-medium">{lift.liftType || '-'}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No lifts found matching your criteria
          </div>
        )}

        {/* Pagination */}
        <div className="bg-white rounded-lg shadow p-3 text-gray-600 flex flex-col xs:flex-row justify-between items-center">
          <span className="text-sm sm:text-base mb-2 xs:mb-0">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredLifts.length)} of {filteredLifts.length}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 sm:px-4 py-1 sm:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition duration-200 text-sm sm:text-base"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 sm:px-4 py-1 sm:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition duration-200 text-sm sm:text-base"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Lift Form Modal (unchanged) */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <LiftForm
          isEdit={isEditModalOpen}
          initialData={currentLift}
          onClose={() => {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            setCurrentLift(null);
          }}
          onSubmitSuccess={fetchData}
          apiBaseUrl={apiBaseUrl}
          dropdownOptions={{
            brandOptions,
            floorOptions,
            machineTypeOptions,
            liftTypeOptions,
            doorTypeOptions,
            machineBrandOptions,
            doorBrandOptions,
            controllerBrandOptions,
            cabinOptions,
            setBrandOptions,
            setFloorOptions,
            setMachineTypeOptions,
            setLiftTypeOptions,
            setDoorTypeOptions,
            setMachineBrandOptions,
            setDoorBrandOptions,
            setControllerBrandOptions,
            setCabinOptions,
          }}
        />
      )}
    </div>
  );
};

export default Lifts;