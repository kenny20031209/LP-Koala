import React, { useState } from 'react';

interface RateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number) => void;
  }

const RateModal = ({ isOpen, onClose, onSubmit }: RateModalProps) => {
  const [rating, setRating] = useState<number>(0);

  if (!isOpen) return null;
  const handleRating = (rate: number) => {
    setRating(rate);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h4 className="font-bold">Rate Activity</h4>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((index) => (
            <span key={index} onClick={() => handleRating(index)} style={{ cursor: 'pointer', padding: '0 5px' }}>
              {index <= rating ? '★' : '☆'}
            </span>
          ))}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded" onClick={onClose}>Cancel</button>
          <button className="bg-black hover:bg-black-700 text-white px-4 py-2 rounded" onClick={() => onSubmit(rating)}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default RateModal;
