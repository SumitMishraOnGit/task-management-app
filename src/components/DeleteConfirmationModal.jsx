import { createPortal } from 'react-dom';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center" style={{ backdropFilter: 'blur(8px)', zIndex: 99999 }}>
      <div className="bg-neutral-800/70 rounded-xl shadow-2xl p-6 md:p-8 w-11/12 max-w-md relative" style={{ zIndex: 100000 }}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-100 text-3xl font-bold transition-colors duration-200"
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-2xl font-semibold text-neutral-50 mb-4 text-center">Delete Task</h3>
        <p className="text-neutral-300 mb-6 text-center">
          Are you sure you want to delete the task "{taskTitle}"? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-700">
          <button
            onClick={onClose}
            className="bg-neutral-600 hover:bg-neutral-700 text-neutral-100 font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteConfirmationModal;
