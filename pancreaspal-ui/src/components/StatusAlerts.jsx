import React from 'react';

export function LoadingSpinner({ size = 'medium', message = 'Loading...' }) {
  const sizeClass = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }[size];

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizeClass} border-4 border-gray-200 border-t-medical-blue rounded-full animate-spin`}></div>
      {message && <p className="text-gray-600">{message}</p>}
    </div>
  );
}

export function ErrorAlert({ message, onDismiss }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <span className="block sm:inline">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
        >
          <span className="text-2xl">&times;</span>
        </button>
      )}
    </div>
  );
}

export function SuccessAlert({ message, onDismiss }) {
  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
      <span className="block sm:inline">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
        >
          <span className="text-2xl">&times;</span>
        </button>
      )}
    </div>
  );
}
