import React from "react";
import NoServicesImage from "../../assets/NoServices.png"
const NoServices = ({ onRetry }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5 py-10 bg-white">
      <div className="w-full max-w-md text-center">

        {/* Illustration */}
        <div className="flex justify-center mb-7">
            <img
                src={NoServicesImage}
                alt="No services available nearby"
                className="w-44 h-40 object-contain"
            />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
          No services available nearby.
        </h2>

        {/* Description */}
        <p className="mt-4 text-base sm:text-lg leading-7 text-slate-500">
          We couldn’t find any stores or delivery services near your current
          location.
        </p>

        {/* Suggestions */}
        <div className="mt-7 rounded-2xl bg-blue-50 px-5 py-5 text-left">
          <div className="flex gap-4">

            {/* Icon */}
            <div className="flex-shrink-0 w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
              </svg>
            </div>

            <div>
              <h3 className="font-bold text-lg text-slate-900">
                Try these options:
              </h3>

              <ul className="mt-2 space-y-1 text-slate-500 text-sm sm:text-base">
                <li>• Check if location permission is enabled</li>
                <li>• Move to a different area</li>
                <li>• Refresh the page</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Retry button */}
        <button
          onClick={onRetry}
          className="
            mt-7
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-full
            bg-blue-600
            px-9
            py-3.5
            text-base
            font-semibold
            text-white
            shadow-md
            transition
            hover:bg-blue-700
            active:scale-95
          "
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 11a8.1 8.1 0 01-2.3 5.7A8 8 0 115 5.3"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 5v5h5"
            />
          </svg>

          Try Again
        </button>

        {/* Bottom message */}
        <div className="mt-8 flex items-center justify-center gap-3 text-sm text-slate-500">
          <span className="hidden sm:block w-14 h-px bg-slate-300" />

          <span>
            We’re working to bring more stores near you{" "}
            <span className="text-red-500">♥</span>
          </span>

          <span className="hidden sm:block w-14 h-px bg-slate-300" />
        </div>
      </div>
    </div>
  );
};

export default NoServices;