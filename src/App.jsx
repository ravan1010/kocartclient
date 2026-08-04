import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './componets/home';

//og
import SignupOne from './signup/signup';
//admin info
import AdminAddress from './admin/admininfo';
import Adminlandmarkdashboard from './admincategory/adminlandmark/adminlandmarkdashboard';

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
import ParcelBooking from './componets/long';
import Clientverify from './signup/otpverify';
import ProtectedClient from './signup/auth/authroute';
import MARCHENTverify from './admin/adminotp';
import MarchentSignup from './admin/adminsignup';
import ProtectedMarchent from './admin/auth/admiarouteauth';
import Confirmation from './componets/cod';
import Adminorder from './admincategory/adminlandmark/adminorder';
import Grocery from './componets/grocery';
import MerchantPage from './componets/resto';
import MARTMerchantVariants from './componets/mart-marchent-varients';
import ServerTypes from './componets/servicetypes';
import BikeParcelOrder from './componets/bikeparcelorder';
import BikeParcelOrders from './componets/BikeParcelOrderscomplete';
import PassengerAuto from './componets/passengerauto';
import PassengerAutoOrders from './componets/passengerautoOrders';
import GoodsAuto from './componets/goodsauto';
import GoodsAutoOrders from './componets/goodsautoOrdes';


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
          <Route path='/client-auth-success' element={<Clientverify />} />

          <Route element={<ProtectedClient />}>
           <Route path='/' element={<Home />} />
          <Route path="/merchant" element={<MerchantPage />} />
          <Route path='/mart/merchant' element={<MARTMerchantVariants /> } />

          <Route path='/mart' element={
            <Grocery />
          } />

          <Route path='/services' element={<ServerTypes />} />
          <Route path='/bike-parcel' element={< BikeParcelOrder /> } />
          <Route path='/bikeParcel/orders' element={<BikeParcelOrders />} />

          <Route path='/PassengerAuto' element={ <PassengerAuto /> } />
          <Route path='/PassengerAuto/orders' element={< PassengerAutoOrders /> } />

          <Route path='/goodsAuto' element={ <GoodsAuto /> } />
          <Route path='/goodsAuto/orders' element={< GoodsAutoOrders /> } />
          
          
          //admin signup
            <Route path='/admin' element={<MarchentSignup />} />
            <Route path='/marchent-auth-success' element={
              <MARCHENTverify />
            } />

            <Route path='/admin/info' element={
              <AdminAddress />
            } />

            <Route element={<ProtectedMarchent />}>
            //admin create adminlandmark product
              <Route path='/adminlandmark/productcreate' element={
                <CreatePost />
              } />

              <Route path='/adminlandmark/update/:id' element={
                <Updatepost />
              } />

         //admin food dashboard
              <Route path='/adminlandmark/dashboard' element={
                <Adminlandmarkdashboard />
              } />
            </Route>

            <Route path='/admin/orders' element={
              <Adminorder />
            } />



//admin dashboard and create, delete based on category



            <Route path='/order' element={
              <Order />
            } />

            <Route path='/local-cart' element={
              <Cart />
            } />

            <Route path='/checkout' element={
              // <ProtectedRoute>
              <Checkout />
              // </ProtectedRoute>
            } />

            {/* <Route path='/' element={
            <Home />
          } /> */}
            <Route path='/explore' element={
              <Explore />
            } />

            <Route path='/profile' element={
              <Profile />
            } />

            <Route path='/address-list' element={
              <Addresslist />
            } />

            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/order-confirmation" element={<Confirmation />} />

            <Route path='/address' element={
              <ToAddress />
            } />

            <Route path='/long' element={
              <ParcelBooking />
            } />
          </Route>

        </Routes>
      </Router>
    </>
  )
}

export default App
