import React from "react";

const LoadingIcon = () => {
  return (
    <div className="flex items-center justify-center min-h-full">
      <div className="w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingIcon;