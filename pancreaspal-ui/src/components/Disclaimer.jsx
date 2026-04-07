import React, { useState } from 'react';

export function Disclaimer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-gray-400 hover:text-gray-600 transition-colors tracking-wide"
      >
        Disclaimer
      </button>

      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="max-w-md w-full rounded-2xl p-8"
            style={{
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              border: '1px solid rgba(255,255,255,0.7)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-semibold text-gray-900 mb-4 tracking-tight">
              Disclaimer
            </h2>
            <div className="text-sm text-gray-500 space-y-3 leading-relaxed">
              <p>
                The information provided by Pancreas Pal is for <span className="text-gray-700 font-medium">educational purposes only</span> and does not constitute medical advice.
              </p>
              <p>
                It is <span className="text-gray-700 font-medium">not a substitute</span> for the professional judgment of a licensed healthcare provider. Always consult a qualified physician for health concerns.
              </p>
              <p>
                <span className="text-gray-700 font-medium">In an emergency</span>, call your local emergency services (e.g., 911) or go to the nearest emergency room immediately.
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="mt-7 text-xs text-gray-400 hover:text-gray-700 transition-colors tracking-wide"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
