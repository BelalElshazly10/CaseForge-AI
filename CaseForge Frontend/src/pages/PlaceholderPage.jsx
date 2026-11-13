import React from 'react';
import { useLocation } from 'react-router-dom';

const PlaceholderPage = () => {
  const location = useLocation();
  const pathName = location.pathname.substring(1);
  const title = pathName.charAt(0).toUpperCase() + pathName.slice(1);

  return (
    <div className="p-8 max-w-5xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-16 text-center max-w-lg">
        <div className="text-6xl mb-6">🚧</div>
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 mb-6">
          This screen is currently under construction. Please check back later when this module is implemented.
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
