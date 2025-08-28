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
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
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

        // Set selectedMonth to the month of the latest complaint
        if (Array.isArray(complaintRes) && complaintRes.length > 0) {
          const latestComplaint = complaintRes.reduce((latest, current) =>
            new Date(current.date) > new Date(latest.date) ? current : latest
          );
          setSelectedMonth(
            new Date(latestComplaint.date).toLocaleString('default', { month: 'long' })
          );
        }
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
        icon: <User className="w-6 h-6 text-[#8280FF]" />,
        color: '#8280FF'
      },
      { 
        title: 'Income', 
        value: income, 
        change: '1.3% Up', 
        trend: 'up', 
        icon: <DollarSign className="w-6 h-6 text-[#FEC53D]" />,
        color: '#FEC53D'
      },
      { 
        title: 'Open Complaints', 
        value: `${openComplaints}/${totalComplaints}`, 
        change: '4.3% Down', 
        trend: 'down', 
        icon: <AlertTriangle className="w-6 h-6 text-[#4AD991]" />,
        color: '#4AD991'
      },
      { 
        title: 'Open Invoice', 
        value: `${openInvoices}/${totalInvoices}`, 
        change: '1.8% Up', 
        trend: 'up', 
        icon: <FileText className="w-6 h-6 text-[#FF9066]" />,
        color: '#FF9066'
      },
      { 
        title: 'Customer', 
        value: customerCount, 
        change: '8.5% Up', 
        trend: 'up', 
        icon: <User className="w-6 h-6 text-[#8280FF]" />,
        color: '#8280FF'
      },
      { 
        title: 'Complaint', 
        value: complaintCount, 
        change: '1.3% Up', 
        trend: 'up', 
        icon: <AlertTriangle className="w-6 h-6 text-[#FEC53D]" />,
        color: '#FEC53D'
      },
    ];
  };

  const stats = useMemo(() => calculateStats(), [amcData, customerData, complaintData, invoiceData]);

  const graphData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Profit',
        data: [50, 75, 60, 80, 65, 90, 70],
        borderColor: '#00B69B', // Figma green
        backgroundColor: 'rgba(0, 182, 155, 0.2)',
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#00B69B',
      },
      {
        label: 'Sales',
        data: [60, 80, 70, 85, 75, 95, 80],
        borderColor: '#4880FF', // Figma blue
        backgroundColor: 'rgba(72, 128, 255, 0.2)',
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#4880FF',
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 12,
            family: 'Nunito Sans',
            weight: '600',
          },
          color: '#202224',
        },
      },
      title: { display: false },
      tooltip: {
        bodyFont: {
          size: 12,
          family: 'Nunito Sans',
        },
      },
    },
    scales: {
      x: { 
        grid: { display: false },
        ticks: {
          font: {
            size: 12,
            family: 'Nunito Sans',
            weight: '600',
          },
          color: 'rgba(41, 44, 47, 0.4)',
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { 
          stepSize: 25,
          font: {
            size: 12,
            family: 'Nunito Sans',
            weight: '600',
          },
          color: 'rgba(41, 44, 47, 0.4)',
        },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
      },
    },
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center bg-[#F5F6FA] min-h-screen">
        <div className="text-lg font-medium text-gray-600">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center bg-[#F5F6FA] min-h-screen">
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
    <div className="p-6 space-y-6 bg-[#F5F6FA] min-h-screen font-['Nunito_Sans',sans-serif]">
      <h1 className="text-3xl font-bold text-[#202224] tracking-tight">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-md flex items-center space-x-4" style={{ boxShadow: '6px 6px 54px 0px rgba(0, 0, 0, 0.05)' }}>
            <div className="w-12 h-12 flex items-center justify-center rounded-full" style={{ backgroundColor: `${stat.color}20` }}>
              {stat.icon}
            </div>
            <div>
              <h3 className="text-gray-500 font-medium text-sm">{stat.title}</h3>
              <div className="text-2xl font-bold my-1 text-[#202224]">{stat.value}</div>
              <div className={`text-xs ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change} {stat.trend === 'up' ? '↑' : '↓'} from {index < 2 ? 'yesterday' : index < 4 ? 'yesterday' : 'past week'}
              </div>
            </div>
          </div>
        ))}
        <div className="bg-white p-4 rounded-xl shadow-md col-span-1 sm:col-span-2 lg:col-span-2 flex items-center space-x-4" style={{ boxShadow: '6px 6px 54px 0px rgba(0, 0, 0, 0.05)' }}>
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#727272]20">
            <Wrench className="w-6 h-6 text-[#727272]" />
          </div>
          <div>
            <h3 className="text-gray-500 font-medium text-sm">AMC Renew in Progress</h3>
            <div className="text-2xl font-bold my-1 text-[#202224]">
              {amcData.filter(amc => amc.status === "Pending").length} AMCs pending renewal
            </div>
          </div>
        </div>
      </div>

      {/* Graph Section */}
      <div className="bg-white p-6 rounded-xl shadow-md" style={{ boxShadow: '6px 6px 54px 0px rgba(0, 0, 0, 0.05)' }}>
        <h3 className="text-xl font-bold text-[#202224] mb-4">Weekly Performance</h3>
        <div className="h-64">
          <Line data={graphData} options={graphOptions} />
        </div>
      </div>

      {/* Complaints Section */}
      <div className="bg-white p-6 rounded-xl shadow-md" style={{ boxShadow: '6px 6px 54px 0px rgba(0, 0, 0, 0.05)' }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h3 className="text-xl font-bold text-[#202224]">New Complaints</h3>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 mt-2 sm:mt-0 w-full sm:w-auto text-sm font-['Circular_Std',sans-serif] text-gray-600"
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F1F4F9] rounded-md">
                <th className="p-3 text-xs font-bold text-[#202224] uppercase rounded-l-md">Print</th>
                <th className="p-3 text-xs font-bold text-[#202224] uppercase">Subject</th>
                <th className="p-3 text-xs font-bold text-[#202224] uppercase">Assigned to</th>
                <th className="p-3 text-xs font-bold text-[#202224] uppercase">Status</th>
                <th className="p-3 text-xs font-bold text-[#202224] uppercase">Created</th>
                <th className="p-3 text-xs font-bold text-[#202224] uppercase">Solution</th>
                <th className="p-3 text-xs font-bold text-[#202224] uppercase rounded-r-md">Remark</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((complaint) => (
                <tr key={complaint.id} className="border-t border-gray-100">
                  <td className="p-3"></td>
                  <td className="p-3 text-sm text-[#202224] opacity-80">{complaint.subject}</td>
                  <td className="p-3 text-sm text-[#202224] opacity-80">{complaint.assign_to_name}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      complaint.solution ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'
                    }`}>
                      {complaint.solution ? 'Closed' : 'Open'}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-[#202224] opacity-80">{new Date(complaint.date).toLocaleString()}</td>
                  <td className="p-3 text-sm text-[#202224] opacity-80">{complaint.solution || '-'}</td>
                  <td className="p-3 text-sm text-[#202224] opacity-80">{complaint.technician_remark || '-'}</td>
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
