
import React from 'react';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 border-4 border-t-brand-secondary border-gray-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-dark-subtext">{message}</p>
    </div>
  );
};

export default Loader;
