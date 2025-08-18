import { useState, useEffect, useMemo } from 'react';
import { User, DollarSign, AlertTriangle, FileText, Wrench } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const [selectedMonth, setSelectedMonth] = useState('October');
  const [amcData, setAmcData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [complaintData, setComplaintData] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get token from where you store it (localStorage, cookies, etc.)
  const getAuthToken = () => {
    return localStorage.getItem('access_token'); // Updated to match the stored key
  };

  const fetchWithAuth = async (url) => {
    const token = getAuthToken();
    if (!token) {
      console.warn('No authentication token found, redirecting to login...');
      window.location.href = '/login'; // Redirect to login page
      return [];
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [amcRes, customerRes, complaintRes, invoiceRes] = await Promise.all([
          fetchWithAuth(`${import.meta.env.VITE_BASE_API}/amc/amc-list/`).catch(e => {
            console.error('Error fetching AMC data:', e);
            setError(prev => prev ? `${prev}, AMC data failed` : 'AMC data failed');
            return [];
          }),
          fetchWithAuth(`${import.meta.env.VITE_BASE_API}/sales/customer-list/`).catch(e => {
            console.error('Error fetching customer data:', e);
            setError(prev => prev ? `${prev}, Customer data failed` : 'Customer data failed');
            return [];
          }),
          fetchWithAuth(`${import.meta.env.VITE_BASE_API}/auth/complaint-list/`).catch(e => {
            console.error('Error fetching complaint data:', e);
            setError(prev => prev ? `${prev}, Complaint data failed` : 'Complaint data failed');
            return [];
          }),
          fetchWithAuth(`${import.meta.env.VITE_BASE_API}/sales/invoice-list/`).catch(e => {
            console.error('Error fetching invoice data:', e);
            setError(prev => prev ? `${prev}, Invoice data failed` : 'Invoice data failed');
            return [];
          }),
        ]);

        setAmcData(Array.isArray(amcRes) ? amcRes : []);
        setCustomerData(Array.isArray(customerRes) ? customerRes : []);
        setComplaintData(Array.isArray(complaintRes) ? complaintRes : []);
        setInvoiceData(Array.isArray(invoiceRes) ? invoiceRes : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load some or all dashboard data. Please check your authentication and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate stats from API data with safe defaults
  const calculateStats = () => {
    const safeAmcData = Array.isArray(amcData) ? amcData : [];
    const safeCustomerData = Array.isArray(customerData) ? customerData : [];
    const safeComplaintData = Array.isArray(complaintData) ? complaintData : [];
    const safeInvoiceData = Array.isArray(invoiceData) ? invoiceData : [];
    
    const amcDue = safeAmcData.filter(amc => amc.status === "Pending").length;
    const income = 10293; // Mock data
    const totalComplaints = safeComplaintData.length;
    const closedComplaints = safeComplaintData.filter(c => c.solution).length;
    const openComplaints = totalComplaints - closedComplaints;
    const totalInvoices = safeInvoiceData.length;
    const openInvoices = safeInvoiceData.filter(inv => inv.status === "open").length;
    const customerCount = safeCustomerData.length;
    const complaintCount = safeComplaintData.length;

    return [
      { 
        title: 'AMC Due', 
        value: amcDue, 
        change: '8.5% Up', 
        trend: 'up', 
        icon: <User className="w-6 h-6 text-purple-500" /> 
      },
      { 
        title: 'Income', 
        value: income, 
        change: '1.3% Up', 
        trend: 'up', 
        icon: <DollarSign className="w-6 h-6 text-yellow-500" /> 
      },
      { 
        title: 'Open Complaints', 
        value: `${openComplaints}/${totalComplaints}`, 
        change: '4.3% Down', 
        trend: 'down', 
        icon: <AlertTriangle className="w-6 h-6 text-green-500" /> 
      },
      { 
        title: 'Open Invoice', 
        value: `${openInvoices}/${totalInvoices}`, 
        change: '1.8% Up', 
        trend: 'up', 
        icon: <FileText className="w-6 h-6 text-orange-500" /> 
      },
      { 
        title: 'Customer', 
        value: customerCount, 
        change: '8.5% Up', 
        trend: 'up', 
        icon: <User className="w-6 h-6 text-purple-500" /> 
      },
      { 
        title: 'Complaint', 
        value: complaintCount, 
        change: '1.3% Up', 
        trend: 'up', 
        icon: <AlertTriangle className="w-6 h-6 text-yellow-500" /> 
      },
    ];
  };

  const stats = useMemo(() => calculateStats(), [amcData, customerData, complaintData, invoiceData]);

  const graphData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Income',
        data: [50, 75, 60, 80, 65, 90, 70],
        borderColor: 'rgb(0, 149, 255)',
        backgroundColor: 'rgba(0, 149, 255, 0.2)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(0, 149, 255)',
      },
      {
        label: 'Services',
        data: [60, 80, 70, 85, 75, 95, 80],
        borderColor: 'rgb(0, 255, 149)',
        backgroundColor: 'rgba(0, 255, 149, 0.2)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(0, 255, 149)',
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 25 },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
      },
    },
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex justify-center items-center bg-gray-50 min-h-screen">
        <div className="text-lg font-medium text-gray-600">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 flex justify-center items-center bg-gray-50 min-h-screen">
        <div className="text-lg font-medium text-red-500">{error}</div>
      </div>
    );
  }

  const months = [...new Set(complaintData.map(complaint => 
    new Date(complaint.date).toLocaleString('default', { month: 'long' })
  ))];
  const filteredComplaints = complaintData.filter(complaint => 
    new Date(complaint.date).toLocaleString('default', { month: 'long' }) === selectedMonth
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4 border border-gray-100">
            {stat.icon}
            <div>
              <h3 className="text-gray-500 font-medium text-sm">{stat.title}</h3>
              <div className="text-xl font-bold my-1">{stat.value}</div>
              <div className={`text-xs ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change} {stat.trend === 'up' ? '↑' : '↓'} from {index < 2 ? 'yesterday' : index < 4 ? 'yesterday' : 'past week'}
              </div>
            </div>
          </div>
        ))}
        <div className="bg-white p-4 rounded-lg shadow-sm col-span-2 sm:col-span-1 lg:col-span-2 flex items-center space-x-4 border border-gray-100">
          <Wrench className="w-6 h-6 text-gray-400" />
          <div>
            <h3 className="text-gray-500 font-medium text-sm">AMC Renew in Progress</h3>
            <div className="text-xl font-bold my-1">
              {amcData.filter(amc => amc.status === "Pending").length} AMCs pending renewal
            </div>
          </div>
        </div>
      </div>

      {/* Graph Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium text-sm">Weekly Performance</h3>
          <div className="h-64">
            <Line data={graphData} options={graphOptions} />
          </div>
        </div>
      </div>

      {/* Complaints Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h3 className="text-gray-500 font-medium text-sm">New Complaints</h3>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 mt-2 sm:mt-0 w-full sm:w-auto"
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-xs">Print</th>
                <th className="p-2 text-xs">Subject</th>
                <th className="p-2 text-xs">Assigned to</th>
                <th className="p-2 text-xs">Status</th>
                <th className="p-2 text-xs">Created</th>
                <th className="p-2 text-xs">Solution</th>
                <th className="p-2 text-xs">Remark</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((complaint) => (
                <tr key={complaint.id} className="border-t">
                  <td className="p-2"></td>
                  <td className="p-2 text-sm">{complaint.subject}</td>
                  <td className="p-2 text-sm">{complaint.assign_to_name}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      complaint.solution ? 'text-green-500 bg-green-100' : 'text-yellow-500 bg-yellow-100'
                    }`}>
                      {complaint.solution ? 'Closed' : 'Open'}
                    </span>
                  </td>
                  <td className="p-2 text-sm">{new Date(complaint.date).toLocaleString()}</td>
                  <td className="p-2 text-sm">{complaint.solution || '-'}</td>
                  <td className="p-2 text-sm">{complaint.technician_remark || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;