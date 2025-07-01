import React, { useState, useEffect } from "react";

export default function LinkPreviewOverlay({ open, url, onClose, onConfirm, onChange }) {
  const [confirmEnabled, setConfirmEnabled] = useState(false);

  // Reset confirm state when url or open changes
  useEffect(() => {
    if (!open) {
      return;
    }

    setConfirmEnabled(false);

    const timer = setTimeout(() => setConfirmEnabled(true), 3000);
    
    return () => clearTimeout(timer);
  }, [url, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        className="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-[80vw] h-[80vh] max-w-[900px] max-h-[90vh] relative flex flex-col items-center justify-center"
      >
        <button
          className="absolute top-3 right-6 text-gray-400 hover:text-gray-700 text-3xl cursor-pointer"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">Link Preview</h2>
        <div className="flex-1 w-full mb-2 bg-gray-100 flex items-center justify-center min-h-[200px]">
          <iframe
            src={url}
            className="w-full h-full border border-gray-500"
          />
        </div>
        <div className="w-full flex justify-center mb-2 min-h-[1.5rem]">
          {confirmEnabled ? (
            <div className="text-red-600 text-center">
              Preview failed to load?{" "}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800 cursor-pointer"
              >
                Open link in new tab
              </a>
            </div>
          ) : null}
        </div>
        <div className="flex gap-4 w-full justify-center pb-2">
          <button
            className={`px-4 py-2 rounded transition
              ${confirmEnabled
                ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                : "bg-blue-200 text-white cursor-not-allowed"
              }`}
            onClick={() => { onConfirm(); onClose(); }}
            disabled={!confirmEnabled}
          >
            Confirm
          </button>
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition cursor-pointer"
            onClick={() => { onChange(); onClose(); }}
          >
            Change
          </button>
        </div>
      </div>
    </div>
  );
}
