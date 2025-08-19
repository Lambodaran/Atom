import React, { useState } from 'react';
import { 
  Search, Printer, Copy, FileText, 
  File, MoreVertical, Calendar 
} from 'lucide-react';

const AMCreport = () => {
  const primaryColor = '#243158';
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Sample AMC data
  const amcReports = [
    {
      sno: '1',
      amcId: 'AMC-2023-001',
      startDate: '01.01.2023',
      endDate: '31.12.2023',
      amcType: 'Comprehensive',
      amcStatus: 'Active',
      contract: 'CON-2023-001',
      amount: '₹50,000',
      paidAmount: '₹30,000',
      dueAmount: '₹20,000',
      ref: 'REF-001',
      jobNo: 'JOB-2023-001',
      siteName: 'T-Nagar Complex',
      siteAddress: '12, Main Road, T-Nagar, Chennai'
    },
    // Add more reports as needed
  ];

  const [filters, setFilters] = useState({
    customer: '',
    city: 'ALL',
    by: 'END DATE',
    routes: '',
    status: 'ALL',
    amcTypes: '',
    period: 'ALL'
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleExport = (type) => {
    setShowExportMenu(false);
    console.log(`Exporting as ${type}`);
    // Implement export functionality here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">AMC Reports</h1>
          <div className="mt-4 md:mt-0 flex gap-2">
            {/* Export Menu */}
            <div className="relative">
              <button 
                className="flex items-center bg-white border rounded-md px-3 py-2 text-sm hover:bg-gray-50"
                style={{ borderColor: primaryColor, color: primaryColor }}
                onClick={() => setShowExportMenu(!showExportMenu)}
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <button 
                      onClick={() => handleExport('copy')}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </button>
                    <button 
                      onClick={() => handleExport('csv')}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      CSV
                    </button>
                    <button 
                      onClick={() => handleExport('print')}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </button>
                    <button 
                      onClick={() => handleExport('pdf')}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <File className="h-4 w-4 mr-2" />
                      PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            {/* Row 1 */}
            <div>
              <label className="text-gray-500 mb-1 block">Customer</label>
              <select 
                name="customer"
                className="w-full border border-gray-300 rounded p-2"
                value={filters.customer}
                onChange={handleFilterChange}
              >
                <option value="">SELECT</option>
                <option>Customer 1</option>
                <option>Customer 2</option>
              </select>
            </div>

            <div>
              <label className="text-gray-500 mb-1 block">City</label>
              <select 
                name="city"
                className="w-full border border-gray-300 rounded p-2"
                value={filters.city}
                onChange={handleFilterChange}
              >
                <option>ALL</option>
                <option>Chennai</option>
                <option>Bangalore</option>
              </select>
            </div>

            <div>
              <label className="text-gray-500 mb-1 block">By</label>
              <select 
                name="by"
                className="w-full border border-gray-300 rounded p-2"
                value={filters.by}
                onChange={handleFilterChange}
              >
                <option>END DATE</option>
                <option>START DATE</option>
                <option>AMC TYPE</option>
              </select>
            </div>

            <div>
              <label className="text-gray-500 mb-1 block">Routes</label>
              <select 
                name="routes"
                className="w-full border border-gray-300 rounded p-2"
                value={filters.routes}
                onChange={handleFilterChange}
              >
                <option value="">SELECT</option>
                <option>Route 1</option>
                <option>Route 2</option>
              </select>
            </div>

            {/* Row 2 */}
            <div>
              <label className="text-gray-500 mb-1 block">Status</label>
              <select 
                name="status"
                className="w-full border border-gray-300 rounded p-2"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option>ALL</option>
                <option>Active</option>
                <option>Expired</option>
              </select>
            </div>

            <div>
              <label className="text-gray-500 mb-1 block">AMC Types</label>
              <select 
                name="amcTypes"
                className="w-full border border-gray-300 rounded p-2"
                value={filters.amcTypes}
                onChange={handleFilterChange}
              >
                <option value="">SELECT</option>
                <option>Comprehensive</option>
                <option>Basic</option>
              </select>
            </div>

            <div>
              <label className="text-gray-500 mb-1 block">Period</label>
              <select 
                name="period"
                className="w-full border border-gray-300 rounded p-2"
                value={filters.period}
                onChange={handleFilterChange}
              >
                <option>ALL</option>
                <option>This Month</option>
                <option>Last Quarter</option>
              </select>
            </div>

            <div className="flex items-end">
              <button 
                className="flex items-center justify-center text-white rounded p-2 w-full transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* AMC Reports Table with Horizontal Scroll */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1500px]"> {/* Set minimum width to accommodate all columns */}
              {/* Table Header */}
              <div className="grid grid-cols-14 bg-gray-100 p-3 font-medium text-gray-700 text-sm border-b border-gray-200">
                <div className="px-2">S. NO</div>
                <div className="px-2">AMC ID</div>
                <div className="px-2">START DATE</div>
                <div className="px-2">END DATE</div>
                <div className="px-2">AMC TYPE</div>
                <div className="px-2">AMC STATUS</div>
                <div className="px-2">CONTRACT</div>
                <div className="px-2">AMOUNT</div>
                <div className="px-2">PAID AMOUNT</div>
                <div className="px-2">DUE AMOUNT</div>
                <div className="px-2">REF</div>
                <div className="px-2">JOB NO</div>
                <div className="px-2">SITE NAME</div>
                <div className="px-2">SITE ADDRESS</div>
              </div>
              
              {/* Table Rows */}
              {amcReports.length > 0 ? (
                amcReports.map((report, index) => (
                  <div key={index} className="grid grid-cols-14 p-3 border-b border-gray-200 text-sm items-center">
                    <div className="px-2">{report.sno}</div>
                    <div className="px-2 font-medium">{report.amcId}</div>
                    <div className="px-2">{report.startDate}</div>
                    <div className="px-2">{report.endDate}</div>
                    <div className="px-2">{report.amcType}</div>
                    <div className="px-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        report.amcStatus === 'Active' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {report.amcStatus}
                      </span>
                    </div>
                    <div className="px-2">{report.contract}</div>
                    <div className="px-2">{report.amount}</div>
                    <div className="px-2">{report.paidAmount}</div>
                    <div className="px-2">{report.dueAmount}</div>
                    <div className="px-2">{report.ref}</div>
                    <div className="px-2">{report.jobNo}</div>
                    <div className="px-2">{report.siteName}</div>
                    <div className="px-2">{report.siteAddress}</div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 col-span-14">
                  No AMC reports found for the selected filters
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="p-3 text-sm text-gray-600 border-t border-gray-200">
            Showing 1-{amcReports.length} of {amcReports.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AMCreport;