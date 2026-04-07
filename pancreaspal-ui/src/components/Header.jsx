import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();

  return (
    <header
      className="w-full px-6 py-3.5 flex justify-between items-center border-b"
      style={{
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderColor: 'rgba(0,0,0,0.06)',
      }}
    >
      <button
        onClick={() => navigate('/faq')}
        className="text-sm text-gray-400 hover:text-gray-700 transition-colors tracking-wide"
      >
        FAQ
      </button>

      <button
        className="text-sm text-gray-400 hover:text-gray-700 transition-colors tracking-wide border rounded-full px-4 py-1"
        style={{ borderColor: 'rgba(0,0,0,0.12)' }}
      >
        Log In
      </button>
    </header>
  );
}
