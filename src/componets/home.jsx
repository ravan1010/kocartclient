import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          <h1 className="text-2xl font-black text-blue-900">
            Goods<span className="text-orange-600">Auto</span>
          </h1>

          <button
            onClick={() => console.log("Change location")}
            className="border px-4 py-2 rounded-xl"
          >
            📍 Change Location
          </button>

        </div>
      </header>

      {/* Services */}
      <main className="max-w-6xl mx-auto px-4 py-8">

        <h2 className="text-2xl font-bold mb-6">
          Choose your vehicle
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          {/* 3 Wheeler */}
          <button
            onClick={() =>
              navigate("/goods-auto", {
                state: { type: "goods_auto" },
              })
            }
            className="text-left min-h-[200px] p-6 rounded-3xl
                       bg-teal-50 border border-teal-200
                       hover:shadow-lg transition"
          >
            <h3 className="text-2xl font-extrabold text-teal-900">
              3 Wheel Goods Auto
            </h3>

            <p className="mt-2 text-gray-600">
              Transport items & shipments
            </p>

            <div className="flex justify-between items-end mt-10">
              <span className="w-11 h-11 rounded-full bg-white
                               flex items-center justify-center text-xl">
                →
              </span>

              <span className="text-5xl">
                🚚
              </span>
            </div>
          </button>

          {/* 4 Wheeler */}
          <button
            onClick={() =>
              navigate("/goods-auto", {
                state: { type: "4_wheel_goods_auto" },
              })
            }
            className="text-left min-h-[200px] p-6 rounded-3xl
                       bg-blue-50 border border-blue-200
                       hover:shadow-lg transition"
          >
            <h3 className="text-2xl font-extrabold text-blue-900">
              4 Wheel Goods Auto
            </h3>

            <p className="mt-2 text-gray-600">
              Transport items & shipments
            </p>

            <div className="flex justify-between items-end mt-10">
              <span className="w-11 h-11 rounded-full bg-white
                               flex items-center justify-center text-xl">
                →
              </span>

              <span className="text-5xl">
                🚚
              </span>
            </div>
          </button>

        </div>
      </main>

    </div>
  );
};

export default Home;