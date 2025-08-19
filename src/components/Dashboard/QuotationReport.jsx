import React, { useState } from 'react';
import { 
  Search, Printer, Copy, FileText, 
  File, MoreVertical, Calendar 
} from 'lucide-react';

const QuotationReport = () => {
  const primaryColor = '#243158';
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Sample quotation data
  const quotations = [
    {
      sno: '1',
      quotationId: 'QUO-2025-001',
      ltma: 'LTMA-001',
      siteName: 'T-Nagar Complex',
      city: 'Chennai',
      state: 'Tamil Nadu',
      mobileNo: '9876543210',
      quotationItem: 'Elevator Maintenance',
      quotationIssueDate: '15.07.2025',
      amcType: 'Comprehensive',
      contractAmount: '₹50,000'
    },
    {
      sno: '2',
      quotationId: 'QUO-2025-002',
      ltma: 'LTMA-002',
      siteName: 'Gachibowli Tech Park',
      city: 'Hyderabad',
      state: 'Telangana',
      mobileNo: '8765432109',
      quotationItem: 'HVAC Maintenance',
      quotationIssueDate: '20.07.2025',
      amcType: 'Basic',
      contractAmount: '₹35,000'
    },
  ];

  const months = [
    'January', 'February', 'March', 'April', 
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  const currentYear = new Date().getFullYear();

  const [filters, setFilters] = useState({
    customer: '',
    provinceState: '',
    routes: '',
    status: '',
    amcTypes: '',
    period: 'ALL',
    month: 'July',
    startDate: '01.07.2025',
    endDate: '31.07.2025'
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
          <h1 className="text-2xl font-bold text-gray-800">Quotation Reports</h1>
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
              <label className="text-gray-500 mb-1 block">Province/State</label>
              <select 
                name="provinceState"
                className="w-full border border-gray-300 rounded p-2"
                value={filters.provinceState}
                onChange={handleFilterChange}
              >
                <option value="">SELECT</option>
                <option>Tamil Nadu</option>
                <option>Karnataka</option>
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

            <div>
              <label className="text-gray-500 mb-1 block">Status</label>
              <select 
                name="status"
                className="w-full border border-gray-300 rounded p-2"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">SELECT</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>

            {/* Row 2 */}
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

            <div>
              <label className="text-gray-500 mb-1 block">Month*</label>
              <select 
                name="month"
                className="w-full border border-gray-300 rounded p-2"
                value={filters.month}
                onChange={handleFilterChange}
              >
                {months.map(month => (
                  <option key={month} value={month}>
                    {month.toUpperCase()}, {currentYear}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-gray-500 mb-1 block">Start Date*</label>
              <div className="flex items-center border border-gray-300 rounded p-2">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <input 
                  type="text" 
                  name="startDate"
                  className="w-full outline-none" 
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            {/* Row 3 */}
            <div>
              <label className="text-gray-500 mb-1 block">End Date</label>
              <div className="flex items-center border border-gray-300 rounded p-2">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <input 
                  type="text" 
                  name="endDate"
                  className="w-full outline-none" 
                  value={filters.endDate}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="md:col-start-4 flex items-end">
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

        {/* Quotation Table with Horizontal Scroll */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1300px]">
              {/* Table Header */}
              <div className="grid grid-cols-11 bg-gray-100 p-3 font-medium text-gray-700 text-sm border-b border-gray-200">
                <div className="px-2">S.No</div>
                <div className="px-2">QUOTATION ID</div>
                <div className="px-2">LTMA</div>
                <div className="px-2">SITE NAME</div>
                <div className="px-2">CITY</div>
                <div className="px-2">STATE</div>
                <div className="px-2">MOBILE NO</div>
                <div className="px-2">QUOTATION ITEM</div>
                <div className="px-2">QUOTATION ISSUE DATE</div>
                <div className="px-2">AMC TYPE</div>
                <div className="px-2 text-right">CONTRACT AMOUNT (WITHOUT GST)</div>
              </div>
              
              {/* Table Rows */}
              {quotations.length > 0 ? (
                quotations.map((quotation, index) => (
                  <div key={index} className="grid grid-cols-11 p-3 border-b border-gray-200 text-sm items-center">
                    <div className="px-2">{quotation.sno}</div>
                    <div className="px-2 font-medium">{quotation.quotationId}</div>
                    <div className="px-2">{quotation.ltma}</div>
                    <div className="px-2">{quotation.siteName}</div>
                    <div className="px-2">{quotation.city}</div>
                    <div className="px-2">{quotation.state}</div>
                    <div className="px-2">{quotation.mobileNo}</div>
                    <div className="px-2">{quotation.quotationItem}</div>
                    <div className="px-2">{quotation.quotationIssueDate}</div>
                    <div className="px-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        quotation.amcType === 'Comprehensive' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {quotation.amcType}
                      </span>
                    </div>
                    <div className="px-2 text-right">{quotation.contractAmount}</div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 col-span-11">
                  No quotations found for the selected filters
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="p-3 text-sm text-gray-600 border-t border-gray-200">
            Showing 1-{quotations.length} of {quotations.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationReport;