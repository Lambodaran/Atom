import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import DashboardPage from './components/Dashboard/Dashboard';
import LiftsPage from './components/Dashboard/Lifts';
import Items from './components/Dashboard/Items';
import CustomerLicense from './components/Dashboard/CustomerLicense';
import AMC from './components/Dashboard/AMC';
import ThisMonthExpire from './components/Dashboard/ThisMonthExpire';
import NextMonthExpire from './components/Dashboard/NextMonthExpire';
import LastMonthExpire from './components/Dashboard/LastMonthExpire';
import Customers from './components/Dashboard/Customers';
import DeliveryChallan from './components/Dashboard/DeliveryChallan';
import Quotation from './components/Dashboard/Quotation';
import Orders from './components/Dashboard/Orders';
import Invoice from './components/Dashboard/Invoice';
import PaymentRecieved from './components/Dashboard/PaymentRecieved';
import RecurringInvoices from './components/Dashboard/RecurringInvoices';
import CreditNotes from './components/Dashboard/CreditNotes';
import RoutineServices from './components/Dashboard/RoutineServices';
import TodayServices from './components/Dashboard/TodayServices';
import RouteWiseServices from './components/Dashboard/RouteWiseServices';
import ThisMonthServices from './components/Dashboard/ThisMonthServices';
import LastMonthServices from './components/Dashboard/LastMonthServices';
import ThisMonthOverdue from './components/Dashboard/ThisMonthOverdue';
import LastMonthOverdue from './components/Dashboard/LastMonthOverdue';
import ThisMonthCompleted from './components/Dashboard/ThisMonthCompleted';
import LastMonthCompleted from './components/Dashboard/LastMonthCompleted';
import PendingAssignServices from './components/Dashboard/PendingAssignServices';
import NewItemForm from './components/Dashboard/Forms/NewItemForm';
import Home from './components/Homepage/Home'; // Assuming Home component exists

// Authentication
import Login from './components/Authentication/Login';
import Signup from './components/Authentication/Signup';
import ResetPasswordPage from './components/Authentication/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home route */}
        <Route path="/" element={<Home />} />

        {/* Wrap dashboard routes with the layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/lifts" element={<LiftsPage />} />
          <Route path="/dashboard/items" element={<Items />} />
          <Route path="/dashboard/customer-license" element={<CustomerLicense />} />
          <Route path="/dashboard/amc" element={<AMC />} />
          <Route path="/dashboard/this-month" element={<ThisMonthExpire />} />
          <Route path="/dashboard/next-month" element={<NextMonthExpire />} />
          <Route path="/dashboard/last-month" element={<LastMonthExpire />} />
          <Route path="/dashboard/customers" element={<Customers />} />
          <Route path="/dashboard/delivery-challan" element={<DeliveryChallan />} />
          <Route path="/dashboard/quotation" element={<Quotation />} />
          <Route path="/dashboard/orders" element={<Orders />} />
          <Route path="/dashboard/invoice" element={<Invoice />} />
          <Route path="/dashboard/payment-received" element={<PaymentRecieved />} />
          <Route path="/dashboard/recurring-invoices" element={<RecurringInvoices />} />
          <Route path="/dashboard/credit-notes" element={<CreditNotes />} />
          <Route path="/dashboard/routine-services" element={<RoutineServices />} />
          <Route path="/dashboard/today-services" element={<TodayServices />} />
          <Route path="/dashboard/route-wise-services" element={<RouteWiseServices />} />
          <Route path="/dashboard/this-month-services" element={<ThisMonthServices />} />
          <Route path="/dashboard/last-month-services" element={<LastMonthServices />} />
          <Route path="/dashboard/this-month-overdue" element={<ThisMonthOverdue />} />
          <Route path="/dashboard/last-month-overdue" element={<LastMonthOverdue />} />
          <Route path="/dashboard/this-month-completed" element={<ThisMonthCompleted />} />
          <Route path="/dashboard/last-month-completed" element={<LastMonthCompleted />} />
          <Route path="/dashboard/pending-assign" element={<PendingAssignServices />} />
        </Route>

        {/* Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* New Item Form route */}
      </Routes>
    </Router>
  );
}

export default App;