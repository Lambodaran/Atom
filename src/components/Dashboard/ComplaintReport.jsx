import React, { useState } from 'react';
import { 
  Search, ChevronDown, ChevronUp, 
  Calendar, Printer, X, Check,
  Copy, FileText, File, MoreVertical 
} from 'lucide-react';

const ComplaintsReport = () => {
  const [expandedFilters, setExpandedFilters] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const primaryColor = '#243158';

  // Sample complaints data
  const complaints = [
    {
      complaintNo: 'CMP-001',
      date: '15.07.2025',
      amcId: 'AMC-1024',
      siteId: 'SITE-5678',
      customer: 'Mr. Rajesh - Chennai',
      type: 'Electrical',
      problem: 'Lift not working',
      resolution: 'Fuse replaced',
      doneBy: 'Technician 1',
      status: 'Closed',
    },
    // Add more complaints as needed
  ];

  const months = [
    'January', 'February', 'March', 'April', 
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState('July');
  const [startDate, setStartDate] = useState('01.07.2025');
  const [endDate, setEndDate] = useState('31.07.2025');

  const handleExport = (type) => {
    setShowExportMenu(false);
    console.log(`Exporting as ${type}`);
    // Add your export logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Complaints Report</h1>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            {/* 3-dot Export Menu */}
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

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-500 mb-1">Customer</div>
              <select className="w-full border border-gray-300 rounded p-2">
                <option>SELECT</option>
                <option>Customer 1</option>
                <option>Customer 2</option>
              </select>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Routes</div>
              <select className="w-full border border-gray-300 rounded p-2">
                <option>SELECT</option>
                <option>Route 1</option>
                <option>Route 2</option>
              </select>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Period</div>
              <select className="w-full border border-gray-300 rounded p-2">
                <option>MONTH</option>
                <option>WEEK</option>
                <option>CUSTOM</option>
              </select>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Month*</div>
              <select 
                className="w-full border border-gray-300 rounded p-2"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map(month => (
                  <option key={month} value={month}>{month.toUpperCase()}, {currentYear}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Start Date*</div>
              <div className="flex items-center border border-gray-300 rounded p-2">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <input 
                  type="text" 
                  className="w-full outline-none" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">End Date</div>
              <div className="flex items-center border border-gray-300 rounded p-2">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <input 
                  type="text" 
                  className="w-full outline-none" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button 
              className="flex items-center justify-center text-white rounded p-2 px-4 transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </button>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-11 bg-gray-100 p-3 font-medium text-gray-700 text-sm border-b border-gray-200">
            <div className="px-2">COMPLAINT NO</div>
            <div className="px-2">DATE</div>
            <div className="px-2">AMC ID</div>
            <div className="px-2">SITE ID</div>
            <div className="px-2">CUSTOMER</div>
            <div className="px-2">TYPE</div>
            <div className="px-2">PROBLEM</div>
            <div className="px-2">RESOLUTION</div>
            <div className="px-2">DONE BY</div>
            <div className="px-2">STATUS</div>
            <div className="px-2">CLOSE | PRINT</div>
          </div>
          
          {/* Table Rows */}
          {complaints.length > 0 ? (
            complaints.map((complaint, index) => (
              <div key={index} className="grid grid-cols-11 p-3 border-b border-gray-200 text-sm items-center">
                <div className="px-2 font-medium">{complaint.complaintNo}</div>
                <div className="px-2">{complaint.date}</div>
                <div className="px-2">{complaint.amcId}</div>
                <div className="px-2">{complaint.siteId}</div>
                <div className="px-2">{complaint.customer}</div>
                <div className="px-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    complaint.type === 'Electrical' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {complaint.type}
                  </span>
                </div>
                <div className="px-2">{complaint.problem}</div>
                <div className="px-2">{complaint.resolution}</div>
                <div className="px-2">{complaint.doneBy}</div>
                <div className="px-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    complaint.status === 'Closed' ? 'bg-green-100 text-green-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {complaint.status}
                  </span>
                </div>
                <div className="px-2 flex gap-2">
                  {complaint.status !== 'Closed' && (
                    <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Printer className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No complaints found for the selected period
            </div>
          )}

          {/* Pagination */}
          <div className="p-3 text-sm text-gray-600 border-t border-gray-200">
            Showing 1-{complaints.length} of {complaints.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsReport;