import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  Settings,
  Package,
  FileText,
  Calendar,
  DollarSign,
  Wrench,
  AlertCircle,
  BarChart2,
  CalendarCheck,
  ClipboardList,
  Warehouse,
  FileBarChart2,
  User,
  LogOut,
  ChevronDown,
  ChevronUp,
  Users,
  CreditCard,
  Repeat,
  FileBadge,
  ShoppingCart,
  ClipboardCheck,
} from 'lucide-react';
import { useState } from 'react';
import logo from '../../assets/logo.png';

const Sidebar = ({ isCollapsed, toggleSidebar, isMobile }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    amc: false,
    sales: false,
    routineServices: false,
  });

  const menuItems = [
    { name: 'Dashboard', icon: <Home className="h-5 w-5" />, path: '/dashboard', key: 'dashboard' },
    { name: 'Lifts', icon: <Settings className="h-5 w-5" />, path: '/dashboard/lifts', key: 'lifts' },
    { name: 'Items', icon: <Package className="h-5 w-5" />, path: '/dashboard/items', key: 'items' },
    { name: 'Customer License', icon: <FileText className="h-5 w-5" />, path: '/dashboard/customer-license', key: 'customer-license' },
    { 
      name: 'AMC', 
      icon: <Calendar className="h-5 w-5" />, 
      path: '/amc', 
      key: 'amc',
      subItems: [
        { name: 'AMC', path: '/dashboard/amc', key: 'amc-all' },
        { name: 'This Month Expire', path: '/dashboard/this-month', key: 'amc-this-month' },
        { name: 'Last Month Expire', path: '/dashboard/last-month', key: 'amc-last-month' },
        { name: 'Next Month Expire', path: '/dashboard/next-month', key: 'amc-next-month' },
      ],
    },
    {
      name: 'Sales',
      icon: <ShoppingCart className="h-5 w-5" />,
      key: 'sales',
      subItems: [
        { name: 'Customers', icon: <Users className="h-5 w-5" />, path: '/dashboard/customers', key: 'customers' },
        { name: 'Delivery Challan', icon: <Package className="h-5 w-5" />, path: '/dashboard/delivery-challan', key: 'delivery-challan' },
        { name: 'Quotation', icon: <FileText className="h-5 w-5" />, path: '/dashboard/quotation', key: 'quotation' },
        { name: 'Orders', icon: <ClipboardList className="h-5 w-5" />, path: '/dashboard/orders', key: 'orders' },
        { name: 'Invoice', icon: <FileText className="h-5 w-5" />, path: '/dashboard/invoice', key: 'invoice' },
        { name: 'Payment Received', icon: <CreditCard className="h-5 w-5" />, path: '/dashboard/payment-received', key: 'paymentReceived' },
        { name: 'Recurring Invoices', icon: <Repeat className="h-5 w-5" />, path: '/dashboard/recurring-invoices', key: 'recurringInvoices' },
        { name: 'Credit Notes', icon: <FileBadge className="h-5 w-5" />, path: '/dashboard/credit-notes', key: 'creditNotes' },
      ],
    },
    {
      name: 'Routine Services',
      icon: <Wrench className="h-5 w-5" />,
      path: '/routine-services',
      key: 'routine-services',
      subItems: [
        { name: 'Routine Services', path: '/dashboard/routine-services', key: 'routine-all' },
        { name: 'Today Services', path: '/dashboard/today-services', key: 'routine-today' },
        { name: 'Route Wise Services', path: '/dashboard/route-wise-services', key: 'routine-route-wise' },
        { name: 'This Month Services', path: '/dashboard/this-month-services', key: 'routine-this-month' },
        { name: 'Last Month Services', path: '/dashboard/last-month-services', key: 'routine-last-month' },
        { name: 'This Month Overdue', path: '/dashboard/this-month-overdue', key: 'routine-this-month-overdue' },
        { name: 'Last Month Overdue', path: '/dashboard/last-month-overdue', key: 'routine-last-month-overdue' },
        { name: 'Last Month Completed', path: '/dashboard/last-month-completed', key: 'routine-last-month-completed' },
        { name: 'This Month Completed', path: '/dashboard/this-month-completed', key: 'routine-this-month-completed' },
        { name: 'Pending Assign', path: '/dashboard/pending-assign', key: 'routine-pending-assign' },
      ],
    },    
    { name: 'Complaints', icon: <AlertCircle className="h-5 w-5" />, path: '/dashboard/complaints', key: 'complaints' },
    { name: 'Monthly Load', icon: <BarChart2 className="h-5 w-5" />, path: '/dashboard/monthly-load', key: 'monthly-load' },
    { name: 'Services Schedule', icon: <CalendarCheck className="h-5 w-5" />, path: '/dashboard/services-schedule', key: 'services-schedule' },
    { name: 'Material Request', icon: <ClipboardList className="h-5 w-5" />, path: '/dashboard/material-request', key: 'material-request' },
    { name: 'Inventory', icon: <Warehouse className="h-5 w-5" />, path: '/dashboard/inventory', key: 'inventory',
        subItems: [
          { name: 'Requisition', path: '/dashboard/requisition', key: 'requisition', icon: <ClipboardList className="h-4 w-4" /> },
          { name: 'Stock Register', path: '/dashboard/stock-register', key: 'stock-register', icon: <ClipboardCheck className="h-4 w-4" /> }
        ],
      },
   {
  name: 'Reports',
  icon: <FileText className="h-5 w-5" />, // Using FileText for the main Reports icon
  path: '/reports',
  key: 'reports',
  subItems: [
    { name: 'Complaint', path: '/dashboard/complaint-report', key: 'report-complaint' },
    { name: 'Life Wise Complaint', path: '/dashboard/life-wise-complaint', key: 'report-life-wise-complaint' },
    { name: 'AMC', path: '/dashboard/amc-report', key: 'report-amc' },
    { name: 'Routine Services', path: '/dashboard/routine-services-report', key: 'report-routine-services' },
    { name: 'AMC Next Payment Due', path: '/dashboard/amc-next-payment-due-report', key: 'report-amc-next-payment-due' },
    { name: 'Invoice', path: '/dashboard/invoice-report', key: 'report-invoice' },
    { name: 'Payment', path: '/dashboard/payment-report', key: 'report-payment' },
    { name: 'Quotation', path: '/dashboard/quotation-report', key: 'report-quotation' },
    { name: 'Expiring', path: '/dashboard/expiring-report', key: 'report-expiring' },
    { name: 'No. of Expired Free Warranty', path: '/dashboard/expired-free-warranty-report', key: 'report-expired-free-warranty' },
  ],
},
    // { name: 'Employees', icon: <Users className="h-5 w-5" />, path: '/dashboard/employees', key: 'employees' },
  ];

  const toggleMenuExpand = (key) => {
    setExpandedMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isMenuActive = (item) => {
    if (item.subItems) {
      return item.subItems.some((subItem) => location.pathname === subItem.path);
    }
    return location.pathname === item.path;
  };

  const handleLogout = async (e) => {
  e.preventDefault();
  
  try {
    // Clear client-side storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Optional: Make API call to logout if your backend requires it
    // await axios.post('/api/auth/logout', {}, { withCredentials: true });
    
    // Redirect to login page
    window.location.href = '/login';
    
    // Close mobile sidebar if open
    if (isMobile) {
      toggleSidebar();
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
};

  return (
    <div className={`
      h-full bg-white text-gray-800 flex flex-col
      ${isCollapsed ? 'w-14' : 'w-56'} 
      ${isMobile ? 'fixed z-50' : 'relative'}
      transition-all duration-300
      border-r border-gray-200
      shadow-sm
    `}>
      {/* Logo Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-center h-16">
        {isCollapsed ? (
          <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
        ) : (
          <img src={logo} alt="Company Logo" className="h-12 object-contain" />
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.key}>
              {item.subItems ? (
                <>
                  <div
                    onClick={() => toggleMenuExpand(item.key)}
                    className={`
                      flex items-center p-3 mx-2 rounded-md cursor-pointer
                      hover:bg-[#243158] hover:text-white transition-colors duration-200
                      ${isCollapsed ? 'justify-center' : 'px-4 justify-between'}
                      ${isMenuActive(item) ? 'bg-[#243158] text-white' : ''}
                    `}
                  >
                    <div className="flex items-center">
                      <span className={`${isCollapsed ? '' : 'mr-3'} ${isMenuActive(item) ? 'text-white' : 'text-gray-600'}`}>
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span className="whitespace-nowrap text-sm font-medium">
                          {item.name}
                        </span>
                      )}
                    </div>
                    {!isCollapsed && (
                      expandedMenus[item.key] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                  
                  {(!isCollapsed && expandedMenus[item.key]) && (
                    <ul className="ml-8 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.key}>
                          <Link
                            to={subItem.path}
                            onClick={() => isMobile && toggleSidebar()}
                            className={`
                              flex items-center p-2 pl-3 rounded-md
                              hover:bg-[#243158] hover:text-white transition-colors duration-200
                              ${location.pathname === subItem.path ? 'bg-[#243158] text-white' : ''}
                            `}
                          >
                            <span className={`mr-3 ${location.pathname === subItem.path ? 'text-white' : 'text-gray-600'}`}>
                              {item.key === 'sales' ? subItem.icon : item.icon}
                            </span>
                            <span className="whitespace-nowrap text-sm font-medium">
                              {subItem.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  onClick={() => isMobile && toggleSidebar()}
                  className={`
                    flex items-center p-3 mx-2 rounded-md
                    hover:bg-[#243158] hover:text-white transition-colors duration-200
                    ${isCollapsed ? 'justify-center' : 'px-4'}
                    ${location.pathname === item.path ? 'bg-[#243158] text-white' : ''}
                  `}
                >
                  <span className={`${isCollapsed ? '' : 'mr-3'} text-gray-600 ${location.pathname === item.path ? 'text-white' : ''}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="whitespace-nowrap text-sm font-medium">
                      {item.name}
                    </span>
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Links */}
      <div className="p-2 border-t border-gray-200">
        <Link
          to="/dashboard/profile"
          onClick={() => isMobile && toggleSidebar()}
          className={`
            flex items-center p-3 mx-2 rounded-md hover:bg-[#243158] hover:text-white
            ${isCollapsed ? 'justify-center' : 'px-4'}
            ${location.pathname === '/profile' ? 'bg-[#243158] text-white' : ''}
          `}
        >
          <User className={`${isCollapsed ? '' : 'mr-3'} h-5 w-5 text-gray-600 ${location.pathname === '/profile' ? 'text-white' : ''}`} />
          {!isCollapsed && <span className="text-sm font-medium">Profile</span>}
        </Link>
      <Link
  to="/login"
  onClick={(e) => {
    handleLogout(e);
    if (isMobile) toggleSidebar();
  }}
  className={`
    flex items-center p-3 mx-2 rounded-md hover:bg-[#243158] hover:text-white
    ${isCollapsed ? 'justify-center' : 'px-4'}
    ${location.pathname === '/logout' ? 'bg-[#243158] text-white' : ''}
  `}
>
  <LogOut className={`${isCollapsed ? '' : 'mr-3'} h-5 w-5 text-gray-600 ${location.pathname === '/logout' ? 'text-white' : ''}`} />
  {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
</Link>
      </div>
    </div>
  );
};

export default Sidebar;