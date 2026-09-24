import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Main pages
import Home from "./componets/home";
import Profile from "./componets/profile";
import GoodsAuto from "./componets/goodsauto";
import GoodsAutoOrders from "./componets/goodsautoOrdes";
import AutoOrders from "./componets/autoOrder";

// Signup / authentication
import SignupOne from "./signup/signup";
import Clientverify from "./signup/otpverify";
import ProtectedClient from "./signup/auth/authroute";

// Location
import AppFullScreenLocationPicker from "./hooks/AppFullScreenLocationPicker";

// Footer / policies
import ReturnRefundPolicy from "./footer/Return_and_Refund_Policy";
import PrivacyPolicy from "./footer/PrivacyPolicy";
import TermsConditions from "./footer/TermsConditions";
import ContactInformationPolicy from "./footer/ContactInformationPolicy";


function App() {
  return (
    <Router>
      <Routes>

        {/* =====================================================
            PUBLIC ROUTES
        ===================================================== */}

        {/* Policies */}
        <Route
          path="/return-refund-policy"
          element={<ReturnRefundPolicy />}
        />

        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/terms-conditions"
          element={<TermsConditions />}
        />

        <Route
          path="/contact-information-policy"
          element={<ContactInformationPolicy />}
        />

        {/* Location Picker */}
        <Route
          path="/location-picker"
          element={<AppFullScreenLocationPicker />}
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={<SignupOne />}
        />

        {/* Client Google / OTP authentication success */}
        <Route
          path="/client-auth-success"
          element={<Clientverify />}
        />


        {/* =====================================================
            PROTECTED CLIENT ROUTES
        ===================================================== */}

        <Route element={<ProtectedClient />}>

          {/* Home */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* =================================================
              GOODS AUTO
          ================================================= */}

          {/* 3 Wheel / 4 Wheel selection */}
          <Route
            path="/goodsauto/:type"
            element={<GoodsAuto />}
          />

          {/* Goods Auto order */}
          <Route
            path="/goodsauto/order/:orderId"
            element={<GoodsAutoOrders />}
          />

          {/* =================================================
              AUTO ORDERS
          ================================================= */}

          <Route
            path="/auto/all/orders"
            element={<AutoOrders />}
          />

          {/* =================================================
              PROFILE
          ================================================= */}

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>

        {/* =====================================================
            404
        ===================================================== */}

        <Route
          path="*"
          element={
            <div
              style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <h1 style={{ fontSize: "48px", margin: 0 }}>
                404
              </h1>

              <p
                style={{
                  color: "#666",
                  marginTop: "10px",
                }}
              >
                Page not found
              </p>
            </div>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;