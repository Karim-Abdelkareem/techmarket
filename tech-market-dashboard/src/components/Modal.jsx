import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 transparent bg-opacity-30 overflow-y-auto flex justify-center items-start pt-20 z-50">
      <div className="relative w-[60vw] max-w-5xl p-6 shadow-lg rounded-lg bg-white">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Add New Product</h3>
        </div>

        <div className="mt-2 mb-4">
          {children}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
