import React from "react";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
    <p className="text-lg text-gray-600 mb-8">Page not found</p>
    <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Back to Home</a>
  </div>
);

export default NotFound; 