import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import PropTypes from 'prop-types'
import Login from './components/Auth/LoginPage'
import Register from './components/Auth/RegistrationPage'
import ForgetPassword from './components/Auth/ForgetPassword'
import OTPVerificationPage from './components/Auth/OTPVerificationPage'
import PasswordResetPage from './components/Auth/ResetPasswordPage'
import EditProfile from './components/Auth/EditProfile'

import Header from './components/Header/Header'
import SearchBar from './components/searchbar/SearchBar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import Terms from './pages/Terms'
import SelectCategory from './components/listing/SelectCategory'
import SubCategory from './components/listing/SubCategory'
import ListingDetails from './components/listing/ListingDetails'
import ListingPublished from './components/listing/ListingPublished'
import FeatureListing from './components/listing/FeatureListing'
import Payment from './components/payment/Payment'
import AddCard from './components/payment/AddCard'
import SavedListings from './components/listings/SavedListings'
import ManageListings from './components/listings/ManageListings'

import ProductDetail from './components/product/ProductDetail'
import MessageBox from './components/messages/MessageBox'
import SearchResults from './pages/SearchResults'
import KYCVerification from './components/kyc/KYCVerification'
import KYCSuccess from './components/kyc/KYCSuccess'

// admin & super admin routes
import AdminPanel from './administration/Admin/AdminPanel/AdminPanel'
import SuperAdminPanel from './administration/superadmin/SuperAdminPanel/SuperAdminPanel'



// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !(user?.is_staff || user?.is_superuser)) {
    return <Navigate to="/" />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  adminOnly: PropTypes.bool
};

// Layout wrapper component
const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/staff-admin' || location.pathname === '/super-admin';

  if (isAdminRoute) {
    return <main>{children}</main>;
  }

  return (
    <>
      <Header />
      <SearchBar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/otp-varification" element={<OTPVerificationPage />} />
            <Route path="/password-reset" element={<PasswordResetPage />} />
            
            {/* Protected Routes */}
            <Route path="/edit-profile" element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } />
            <Route path="/listing/select-category" element={
              <ProtectedRoute>
                <SelectCategory />
              </ProtectedRoute>
            } />
            <Route path="/listing/published" element={
              <ProtectedRoute>
                <ListingPublished />
              </ProtectedRoute>
            } />
            <Route path="/feature-listing" element={
              <ProtectedRoute>
                <FeatureListing />
              </ProtectedRoute>
            } />
            <Route path="/payment" element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            } />
            <Route path="/add-card" element={
              <ProtectedRoute>
                <AddCard />
              </ProtectedRoute>
            } />
            <Route path="/saved-listings" element={
              <ProtectedRoute>
                <SavedListings />
              </ProtectedRoute>
            } />
            <Route path="/manage-listings" element={
              <ProtectedRoute>
                <ManageListings />
              </ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute>
                <MessageBox />
              </ProtectedRoute>
            } />

            {/* Public Routes */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/listing/subcategory/:slug" element={<SubCategory />} />
            <Route path="/listing/details/:categoryId/:subCategoryId" element={<ListingDetails />} />
            <Route path="/listing/edit/:id" element={
              <ProtectedRoute>
                <ListingDetails />
              </ProtectedRoute>
            } />
            
            <Route path="/search" element={<SearchResults />} />
            <Route path="/kyc" element={<KYCVerification />} />
            <Route path="/kyc-success" element={<KYCSuccess />} />

            <Route 
              path="/super-admin" 
              element={
                <ProtectedRoute adminOnly>
                  <SuperAdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/staff-admin" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />

            <Route path="/admin/messages" element={<MessageBox />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;