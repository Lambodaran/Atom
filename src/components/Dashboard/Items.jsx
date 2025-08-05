import { useState } from 'react';
import { Link } from 'react-router-dom';
import NewItemForm from '../Dashboard/Forms/NewItemForm';
import { MoreVertical, Edit, Trash2, Download, Upload } from 'lucide-react';

const Items = () => {
  const [items, setItems] = useState([
    { partNo: 277951, name: 'Inspection Box', type: 'Nos', salePrice: 0, purchasePrice: 0, taxPreference: 'Taxable', tax: 'GST18(18%)' },
    { partNo: 277952, name: 'Inspection Box', type: 'Nos', salePrice: 0, purchasePrice: 0, taxPreference: 'Taxable', tax: 'GST18(18%)' },
    { partNo: 277953, name: 'Inspection Box', type: 'Nos', salePrice: 0, purchasePrice: 0, taxPreference: 'Taxable', tax: 'GST18(18%)' },
    { partNo: 277954, name: 'Inspection Box', type: 'Nos', salePrice: 0, purchasePrice: 0, taxPreference: 'Taxable', tax: 'GST18(18%)' },
    { partNo: 277955, name: 'Inspection Box', type: 'Nos', salePrice: 0, purchasePrice: 0, taxPreference: 'Taxable', tax: 'GST18(18%)' },
    { partNo: 277956, name: 'Inspection Box', type: 'Nos', salePrice: 0, purchasePrice: 0, taxPreference: 'Taxable', tax: 'GST18(18%)' },
    { partNo: 277957, name: 'Inspection Box', type: 'Nos', salePrice: 0, purchasePrice: 0, taxPreference: 'Taxable', tax: 'GST18(18%)' },
    { partNo: 277958, name: 'Inspection Box', type: 'Nos', salePrice: 0, purchasePrice: 0, taxPreference: 'Taxable', tax: 'GST18(18%)' },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 7;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handleFormSubmit = (newItem) => {
    setItems((prev) => [...prev, newItem]);
    setShowModal(false);
  };

  const handleFormCancel = () => {
    setShowModal(false);
  };

  const handleDelete = (partNo) => {
    setItems((prev) => prev.filter(item => item.partNo !== partNo));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Items</h1>
        <div className="space-x-4 flex items-center">
        
          <div className="relative group">
            <button className="text-gray-500 hover:text-gray-700 focus:outline-none p-2">
              <MoreVertical size={20} />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg hidden group-hover:block">
              <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100">
                <Download size={16} className="mr-2" /> Export
              </button>
              <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100">
                <Upload size={16} className="mr-2" /> Import CSV
              </button>
            </div>
          </div>

            <button
            onClick={() => setShowModal(true)}
            className="bg-[#243158] text-white px-4 py-2 rounded-lg hover:bg-[#141929] transition duration-200 w-full md:w-auto"
            aria-label="New Item"
          >
            New Item
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                <th className="p-4 text-left">Part No</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Units</th>
                <th className="p-4 text-left">Sale Price</th>
                <th className="p-4 text-left">Purchase Price</th>
                <th className="p-4 text-left">Tax Preference</th>
                <th className="p-4 text-left">Tax</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.partNo} className="border-t hover:bg-gray-50 transition duration-200">
                  <td className="p-4 text-gray-800">{item.partNo}</td>
                  <td className="p-4 text-gray-800">{item.name}</td>
                  <td className="p-4 text-gray-800">{item.type}</td>
                  <td className="p-4 text-gray-800">{item.units || 'N/A'}</td>
                  <td className="p-4 text-gray-800">{item.salePrice}</td>
                  <td className="p-4 text-gray-800">{item.purchasePrice}</td>
                  <td className="p-4 text-gray-800">{item.taxPreference}</td>
                  <td className="p-4 text-gray-800">{item.tax}</td>
                  <td className="p-4 flex space-x-2">
                    <button className="text-blue-500 hover:text-blue-700" aria-label="Edit">
                      <Edit size={16} />
                    </button>
                    <button className="text-red-500 hover:text-red-700" aria-label="Delete" onClick={() => handleDelete(item.partNo)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden">
          {currentItems.map((item) => (
            <div key={item.partNo} className="border-b p-4">
              <div className="text-gray-800 font-semibold">Part No: {item.partNo}</div>
              <div className="text-gray-800">Name: {item.name}</div>
              <div className="text-gray-800">Type: {item.type}</div>
              <div className="text-gray-800">Units: {item.units || 'N/A'}</div>
              <div className="text-gray-800">Sale Price: {item.salePrice}</div>
              <div className="text-gray-800">Purchase Price: {item.purchasePrice}</div>
              <div className="text-gray-800">Tax Preference: {item.taxPreference}</div>
              <div className="text-gray-800">Tax: {item.tax}</div>
              <div className="p-2 flex space-x-2">
                <button className="text-blue-500 hover:text-blue-700" aria-label="Edit">
                  <Edit size={16} />
                </button>
                <button className="text-red-500 hover:text-red-700" aria-label="Delete" onClick={() => handleDelete(item.partNo)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 text-gray-600 flex flex-col md:flex-row justify-between items-center">
          <span>
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, items.length)} of {items.length}
          </span>
          <div className="space-x-2 mt-2 md:mt-0">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition duration-200"
              aria-label="Previous Page"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition duration-200"
              aria-label="Next Page"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showModal && (
  <div
    className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50"
    onClick={() => setShowModal(false)}
    aria-label="Close modal"
  >
    <div
      className=" rounded-lg bg-gray-50 shadow-lg  max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <NewItemForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} items={items} />
    </div>
  </div>
)}
    </div>
  );
};

export default Items;