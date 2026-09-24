
import React from "react";

/* =====================================================
   GOODS AUTO BOOKING GUIDE
===================================================== */

const BookingStep = ({
  number,
  icon,
  title,
  description,
}) => {
  return (
    <div className="flex gap-4 items-start">
      {/* Step Number */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
          {number}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>

          <h3 className="font-bold text-gray-900 text-base">
            {title}
          </h3>
        </div>

        <p className="text-sm text-gray-500 mt-1 leading-6">
          {description}
        </p>
      </div>
    </div>
  );
};

const GoodsAutoBookingGuide = () => {
  return (
    <section className="mt-8 px-4 pb-8">
      <div className="max-w-3xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="text-center mb-6">
          <div className="text-4xl mb-2">
            🛺
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            How Goods Auto Booking Works
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Book a nearby goods vehicle in a few simple steps
          </p>
        </div>

        {/* =================================================
            GUIDE CARD
        ================================================= */}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">

          <div className="space-y-6">

            <BookingStep
              number="1"
              icon="🛺🚚"
              title="Choose Your Vehicle"
              description="Select the vehicle you need — 3-Wheeler Goods Auto or 4-Wheeler Goods Auto."
            />

            <BookingStep
              number="2"
              icon="📍"
              title="Select Pickup & Drop"
              description="Choose where the goods should be picked up and where they need to be delivered."
            />

            <BookingStep
              number="3"
              icon="📦"
              title="Enter Goods Details"
              description="Add the goods type, quantity, approximate weight and any special instructions."
            />

            <BookingStep
              number="4"
              icon="✅"
              title="Continue & Confirm"
              description="Check your pickup, drop and goods details, then confirm your booking request."
            />

            <BookingStep
              number="5"
              icon="🛺"
              title="Nearby Drivers Bid"
              description="KOCART finds nearby available goods-auto drivers. Drivers can send their fare amount for your booking."
            />

            <BookingStep
              number="6"
              icon="💰"
              title="Choose Your Driver"
              description="Compare the available driver bids and select the driver you want for your delivery."
            />

            <BookingStep
              number="7"
              icon="🔐"
              title="Share Pickup OTP"
              description="When the driver reaches the pickup location, share the pickup OTP to start the delivery."
            />

            <BookingStep
              number="8"
              icon="🔐"
              title="Share Delivery OTP"
              description="After your goods are delivered, share the delivery OTP to securely complete the order."
            />

          </div>

        </div>

        {/* =================================================
            SAFETY NOTE
        ================================================= */}

        <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-2xl p-4">

          <div className="flex gap-3">

            <div className="text-xl">
              🔒
            </div>

            <div>
              <p className="font-semibold text-indigo-900 text-sm">
                OTP Protected Delivery
              </p>

              <p className="text-xs text-indigo-700 mt-1 leading-5">
                Never share your pickup OTP before the driver reaches
                the pickup location. Share the delivery OTP only after
                your goods have been delivered.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};


/* =====================================================
   EXAMPLE HOME SECTION
===================================================== */

const GoodsAutoServices = ({
  services,
  navigate,
}) => {
  return (
    <div className="px-4">

      {/* =================================================
          SERVICE CARDS
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {services.includes("goods_auto") && (
          <ServiceCard
            title="3 Wheel Goods Auto"
            description="Transport goods, parcels & shipments"
            icon="🛺"
            type="goods3"
            onPress={() =>
              navigate("/goodsAuto/goods_auto")
            }
          />
        )}

        {services.includes("4_wheel_goods_auto") && (
          <ServiceCard
            title="4 Wheel Goods Auto"
            description="Transport heavy goods & shipments"
            icon="🚚"
            type="goods4"
            onPress={() =>
              navigate("/goodsAuto/4_wheel_goods_auto")
            }
          />
        )}

      </div>

      {/* =================================================
          BOOKING GUIDE
      ================================================= */}

      <GoodsAutoBookingGuide />

    </div>
  );
};

export default GoodsAutoBookingGuide;

