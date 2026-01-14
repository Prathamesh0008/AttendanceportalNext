// Modal.js
'use client';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-70" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md">
          <div className="p-6">
            {title && (
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <button 
                  onClick={onClose} 
                  className="text-gray-400 hover:text-white p-1 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;