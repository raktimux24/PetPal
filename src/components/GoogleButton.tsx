import React from 'react';

interface GoogleButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export function GoogleButton({ onClick, disabled = false, label = 'Continue with Google' }: GoogleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        className="w-5 h-5 mr-3"
      />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}