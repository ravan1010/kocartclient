// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// // Main pages
// import Home from "./componets/home";
// import Profile from "./componets/profile";
// import GoodsAuto from "./componets/goodsauto";
// import GoodsAutoOrders from "./componets/goodsautoOrdes";
// import AutoOrders from "./componets/autoOrder";

// // Signup / authentication
// import SignupOne from "./signup/signup";
// import Clientverify from "./signup/otpverify";
// import ProtectedClient from "./signup/auth/authroute";

// // Location
// import AppFullScreenLocationPicker from "./hooks/AppFullScreenLocationPicker";

// // Footer / policies
// import ReturnRefundPolicy from "./footer/Return_and_Refund_Policy";
// import PrivacyPolicy from "./footer/PrivacyPolicy";
// import TermsConditions from "./footer/TermsConditions";
// import ContactInformationPolicy from "./footer/ContactInformationPolicy";
// import GoodsAutoTracking from "./componets/track";
// import BusDriverSearch from "./pages/BusDriverSearch";
// import BusDriverTracking from "./pages/BusDriverTracking";


// function App() {
//   return (
//     <Router>
//       <Routes>

//         {/* =====================================================
//             PUBLIC ROUTES
//         ===================================================== */}
//          <Route
//             path="/"
//             element={<BusDriverSearch />}
//           />

//           <Route
//           path="/track-driver/:driverId"
//           element={<BusDriverTracking />}
//         />
        
//         {/* Policies */}
//         <Route
//           path="/return-refund-policy"
//           element={<ReturnRefundPolicy />}
//         />

//         <Route
//           path="/privacy-policy"
//           element={<PrivacyPolicy />}
//         />

//         <Route
//           path="/terms-conditions"
//           element={<TermsConditions />}
//         />

//         <Route
//           path="/contact-information-policy"
//           element={<ContactInformationPolicy />}
//         />

//         {/* Location Picker */}
//         <Route
//           path="/location-picker"
//           element={<AppFullScreenLocationPicker />}
//         />

//         {/* Signup */}
//         <Route
//           path="/signup"
//           element={<SignupOne />}
//         />

//         {/* Client Google / OTP authentication success */}
//         <Route
//           path="/client-auth-success"
//           element={<Clientverify />}
//         />


//         {/* =====================================================
//             PROTECTED CLIENT ROUTES
//         ===================================================== */}

//         <Route element={<ProtectedClient />}>

//           {/* Home */}
         

//           {/* =================================================
//               GOODS AUTO
//           ================================================= */}

//           {/* 3 Wheel / 4 Wheel selection */}
//           <Route
//             path="/goodsauto/:type"
//             element={<GoodsAuto />}
//           />

//           {/* Goods Auto order */}
//           <Route
//             path="/goodsauto/order/:orderId"
//             element={<GoodsAutoOrders />}
//           />

//            {/* =================================================
//               TRACK ORDER
//           ================================================= */}

//           <Route
//             path="/track"
//             element={<GoodsAutoTracking />}
//           />


//           {/* =================================================
//               AUTO ORDERS
//           ================================================= */}

//           <Route
//             path="/auto/all/orders"
//             element={<AutoOrders />}
//           />

//           {/* =================================================
//               PROFILE
//           ================================================= */}

//           <Route
//             path="/profile"
//             element={<Profile />}
//           />

//         </Route>

//         {/* =====================================================
//             404
//         ===================================================== */}

//         <Route
//           path="*"
//           element={
//             <div
//               style={{
//                 minHeight: "100vh",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexDirection: "column",
//                 padding: "20px",
//                 textAlign: "center",
//               }}
//             >
//               <h1 style={{ fontSize: "48px", margin: 0 }}>
//                 404
//               </h1>

//               <p
//                 style={{
//                   color: "#666",
//                   marginTop: "10px",
//                 }}
//               >
//                 Page not found
//               </p>
//             </div>
//           }
//         />

//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from "react";
import { Download, Store } from "lucide-react";
import "./App.css";

export default function App() {
  const apkUrl = "/downloads/kocart.apk";
  const merchantUrl = "https://parcelandtransport.kocart.online";

  return (
    <div className="app-container">
      <div className="action-card">
        <div className="app-logo">K</div>

        <h1>Welcome to Kocart</h1>
        <p className="subtitle">
          Download our app or access the merchant dashboard.
        </p>

        <div className="action-buttons">
          <a
            href={apkUrl}
            download
            className="action-btn download-btn"
          >
            <Download size={21} />
            <span>Download APK</span>
          </a>

          <a
            href={merchantUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn merchant-btn"
          >
            <Store size={21} />
            <span>Merchant Portal</span>
          </a>
        </div>

        <p className="footer-text">
          Fast, simple and convenient.
        </p>
      </div>
    </div>
  );
}