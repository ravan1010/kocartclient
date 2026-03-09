import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './componets/home';

//og
import SignupOne from './signup/signup';
import ProtectedRoute from './signup/auth/authroute/atokenroute';

//admin
import ADMINsignup from './admin/adminsignup';
//admin otp to verify
import ProtectedRouteADMINOTP from './admin/auth/adminauthroute/adminotproute';
import AdminOTPverify from './admin/adminotp';
//admin info
import AdminAddress from './admin/admininfo';
import ProtectedRouteADMININFO from './admin/auth/adminauthroute/admininforoute'
import ProtectedRouteADMINMain from './admin/auth/adminauthroute/adminMainroute';

//adminlandmark dashboard and product create route
import Adminlandmark from './admincategory/adminlandmark/adminlandmarkcreate';
import Adminlandmarkdashboard from './admincategory/adminlandmark/adminlandmarkdashboard';


import CategoryPage from './componets/category';

import ToAddress from './componets/address';
import Profile from './componets/profile';
import Addresslist from './componets/addresslist';

import Explore from './componets/Explore';
import Cart from './componets/cart'
import Checkout from './componets/checkout';
import { Order } from './componets/order';

import CreatePost from './admincategory/adminlandmark/adminlandmarkcreate';
import Updatepost from './admincategory/adminlandmark/update';
import PaymentSuccess from './componets/PaymentSuccess';

import ReturnRefundPolicy from './footer/Return_and_Refund_Policy';
import PrivacyPolicy from './footer/PrivacyPolicy';
import TermsConditions from './footer/TermsConditions';
import ShippingPolicy from './footer/ShippingPolicy';
import ContactInformationPolicy from './footer/ContactInformationPolicy';


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/return-refund-policy" element={<ReturnRefundPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/contact-information-policy" element={<ContactInformationPolicy />} />
        //user email or number for signup
          <Route path='/signup' element={<SignupOne />} />

          //admin signup
          <Route path='/admin' element={
            <ProtectedRoute >
              <ADMINsignup />
            </ProtectedRoute>
          } />

        //admin otp
          <Route path='/admin/verify' element={
            <ProtectedRoute >
              <ProtectedRouteADMINOTP >
                <AdminOTPverify />
              </ProtectedRouteADMINOTP>
            </ProtectedRoute>
          } />
          <Route path='/admin/info' element={
            <ProtectedRoute>
              <ProtectedRouteADMININFO>
                <AdminAddress />
              </ProtectedRouteADMININFO>
            </ProtectedRoute>
          } />
        


//admin dashboard and create, delete based on category
          //admin create adminlandmark product
          <Route path='/adminlandmark/productcreate' element={
            <ProtectedRoute>
              <ProtectedRouteADMINMain>
                <CreatePost />
              </ProtectedRouteADMINMain>
            </ProtectedRoute>
          } />

          <Route path='/adminlandmark/update/:id' element={
            <ProtectedRoute>
              <ProtectedRouteADMINMain>
                <Updatepost />
              </ProtectedRouteADMINMain>
            </ProtectedRoute>
          } />

         //admin food dashboard
          <Route path='/adminlandmark/dashboard' element={
            <ProtectedRoute>
              <ProtectedRouteADMINMain>
                <Adminlandmarkdashboard />
              </ProtectedRouteADMINMain>
            </ProtectedRoute>
          } />

          <Route path='/order' element={
            <Order />
          } />

          <Route path='/cart' element={
            <Cart />
          } />

          <Route path='/checkout' element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />

          <Route path='/' element={
              <Home />
          } />
          <Route path='/explore' element={
            <ProtectedRoute><Explore /></ProtectedRoute>
          } />
          <Route path='/events' element={
            <ProtectedRoute>
              <CategoryPage />
            </ProtectedRoute>
          } />

          <Route path='/profile' element={
            <Profile />
          } />

          <Route path='/address-list' element={
            <ProtectedRoute>
              <Addresslist />
            </ProtectedRoute>
          } />

          <Route path="/payment-success" element={<PaymentSuccess />} />

          <Route path='/address' element={
            <ProtectedRoute >
              <ToAddress />
            </ProtectedRoute>
          } />


        </Routes>
      </Router>
    </>
  )
}

export default App
