import { useEffect } from 'react';

interface ExitConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ExitConfirmationModal({ isOpen, onConfirm, onCancel }: ExitConfirmationModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-vault-gray-800 rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-scale-in">
        {/* Icon */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-8 flex justify-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold font-display text-vault-black dark:text-white mb-3 text-center">
            Exit to Website?
          </h2>
          <p className="text-vault-gray-600 dark:text-vault-gray-400 text-center mb-6">
            Are you sure you want to exit the app and return to the Vault22 website? You'll need to log in again to access your dashboard.
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-vault-gray-100 dark:bg-vault-gray-700 text-vault-gray-900 dark:text-vault-gray-100 rounded-xl font-semibold hover:bg-vault-gray-200 dark:hover:bg-vault-gray-600 hover:scale-105 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 hover:scale-105 hover:shadow-lg transition-all duration-300 shadow-lg"
            >
              Exit App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
