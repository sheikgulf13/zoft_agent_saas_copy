import React, { useState } from 'react';
import ReactDOM from "react-dom/client";

const ConfirmationModal = (props) => {
  const { content, onSuccess, onCancel, type = 'default' } = props;
  const [deleteText, setDeleteText] = useState('');
  const isDeleteType = type === 'delete';
  const requiredText = "delete my workspace";
  const isDeleteValid = deleteText === requiredText;

  const handleDeleteTextChange = (e) => {
    setDeleteText(e.target.value);
  };

  const handleSuccess = () => {
    if (isDeleteType && !isDeleteValid) return;
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-[480px] max-w-[90vw] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-8 py-4 border-b border-gray-200">
          <h2 className={`text-xl font-semibold ${isDeleteType ? 'text-red-600' : 'text-gray-900'}`}>
            {isDeleteType ? 'Delete Workspace' : 'Confirmation'}
          </h2>
        </div>

        {/* Content */}
        <div className="px-8 py-4">
          <p className="text-gray-700 mb-4">{content}</p>

          {isDeleteType && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                To confirm deletion, please type <span className="text-red-600 font-medium">"{requiredText}"</span>
              </p>
              
              <div className="relative">
                <input
                  type="text"
                  value={deleteText}
                  onChange={handleDeleteTextChange}
                  placeholder={`Type "${requiredText}" to confirm`}
                  className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-colors text-gray-900
                    ${deleteText !== '' && !isDeleteValid 
                      ? 'border-red-600 focus:border-red-600' 
                      : isDeleteValid 
                        ? 'border-green-600 focus:border-green-600'
                        : 'border-gray-300 focus:border-blue-600'
                    }`}
                />
                {deleteText !== '' && !isDeleteValid && (
                  <p className="mt-1 text-xs text-red-600">
                    Text doesn't match. Please type exactly as shown above.
                  </p>
                )}
                {isDeleteValid && (
                  <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                    <span>✓</span> Text matches. You can now proceed with deletion.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSuccess}
            disabled={isDeleteType && !isDeleteValid}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors
              ${isDeleteType 
                ? 'bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-500' 
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isDeleteType ? 'Delete' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

const showConfirmationModal = (content, onSuccess, type = 'default') => {
  if (typeof window === "undefined") {
    return;
  }
  const modalContainer = document.createElement("div");
  document.body.appendChild(modalContainer);

  const unmount = () => {
    root.unmount();
    document.body.removeChild(modalContainer);
  };

  const root = ReactDOM.createRoot(modalContainer);
  root.render(
    <ConfirmationModal
      content={content}
      type={type}
      onSuccess={() => {
        onSuccess();
        unmount();
      }}
      onCancel={unmount}
    />
  );
};

export { ConfirmationModal, showConfirmationModal };
