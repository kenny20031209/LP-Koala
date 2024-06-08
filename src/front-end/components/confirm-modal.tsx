import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm }: {isOpen: boolean, onClose: React.MouseEventHandler<HTMLButtonElement>, onConfirm: React.MouseEventHandler<HTMLButtonElement>}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h4 className="font-bold">Confirm Deletion</h4>
        <p>Are you sure you want to delete?</p>
        <div className="mt-4 flex justify-end gap-2">
          <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded" onClick={onClose}>Cancel</button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
