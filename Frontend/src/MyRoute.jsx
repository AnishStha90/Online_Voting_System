import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/Home';
import Election from './pages/Election';
import Profile from './pages/Profile';
import PartyList from './pages/PartyList';

// Layouts
import Layout from './pages/layout/Layout';
import AdminLayout from './pages/admin/AdminLayout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminElection from './pages/admin/AdminElection';
import AdminParty from './pages/admin/AdminParty';
import AdminVoters from './pages/admin/AdminVoters';
import AdminProfile from './pages/admin/AdminProfile';
import ElectionsList from './pages/ElectionList';
import AdminPartyMemberForm from './pages/admin/AdminPartyMemberForm';
import PartyMembers from './pages/PartyMembers';
import PartyDetail from './pages/admin/PartyDetail';
import LiveResults from './pages/LiveResults';
import LandingPage from './pages/LandingPage';
import Contact_Us from './pages/Contact_Us';
import AdminInquiriesList from './pages/admin/AdminInquiriesList';
import AdminFeedback from './pages/admin/AdminFeedback';
import UserFeedback from './pages/UserFeedback';

const MyRoute = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route index element={<LandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User routes (Protected) */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="home" element={<Home />} />
            <Route path="party" element={<PartyList />} />
            <Route path="party/:partyId/members" element={<PartyMembers />} />
            <Route path="profile" element={<Profile />} />
            <Route path="elections" element={<ElectionsList />} />
            <Route path="elections/:id" element={<Election />} />
            <Route path="elections/:id/results" element={<LiveResults />} />
            <Route path="contact_us" element={<Contact_Us/>}/>
            <Route path="feedback" element={<UserFeedback/>}/>
          </Route>

          {/* Admin routes (Admin Protected) */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="party" element={<AdminParty />} />
            <Route path="party/:partyId" element={<PartyDetail />} />
            <Route path="election" element={<AdminElection />} />
            <Route path="voters" element={<AdminVoters />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="partymembers/new" element={<AdminPartyMemberForm />} />
            <Route path="inquires" element={<AdminInquiriesList/>}/>
            <Route path="feedback/:id" element={<AdminFeedback/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default MyRoute;