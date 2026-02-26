import React from "react";

export default function LoadingOverlay({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white px-10 py-8 rounded-2xl shadow-2xl flex flex-col items-center">

        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>

        {/* Loading Text */}
        <p className="text-gray-700 font-medium text-lg">
          {message}
        </p>

      </div>

    </div>
  );
}