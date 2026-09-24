import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './componets/home';

//og
import SignupOne from './signup/signup';
//admin info

import Profile from './componets/profile';

import ReturnRefundPolicy from './footer/Return_and_Refund_Policy';
import PrivacyPolicy from './footer/PrivacyPolicy';
import TermsConditions from './footer/TermsConditions';
import ContactInformationPolicy from './footer/ContactInformationPolicy';


import ProtectedClient from './signup/auth/authroute';


import GoodsAuto from './componets/goodsauto';
import GoodsAutoOrders from './componets/goodsautoOrdes';
import AutoOrders from './componets/autoOrder';
import AppFullScreenLocationPicker from './hooks/AppFullScreenLocationPicker';
import Clientverify from './signup/otpverify';


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/return-refund-policy" element={<ReturnRefundPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/contact-information-policy" element={<ContactInformationPolicy />} />
   <Route
  path="/location-picker"
  element={<AppFullScreenLocationPicker />}
/>
        //user email or number for signup
          <Route path='/signup' element={<SignupOne />} />
          <Route path='/client-auth-success' element={<Clientverify />} />

          <Route element={<ProtectedClient />}>
           {/* <Route path='/' element={<Home />} /> */}
  

          <Route path='/' element={<Home />} />

          <Route path='/goodsAuto/:type' element={ <GoodsAuto /> } />
          <Route path='/goodsAuto/order/:orderId' element={< GoodsAutoOrders /> } />


          <Route path='/auto/all/orders' element={<AutoOrders /> } />

            <Route path='/profile' element={
              <Profile />
            } />
          </Route>

        </Routes>
      </Router>
    </>
  )
}

export default App
