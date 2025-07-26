import React from 'react';

interface TypeSelectorProps {
  selectedType: 'digit' | 'alphabet';
  onTypeChange: (type: 'digit' | 'alphabet') => void;
}

const TypeSelector: React.FC<TypeSelectorProps> = ({
  selectedType,
  onTypeChange
}) => {
  return (
    <div className="border border-gray-300 p-6">
      <div className="text-sm font-medium text-black mb-3">Type</div>
      <div className="flex space-x-2">
        <button
          onClick={() => onTypeChange('digit')}
          className={`px-4 py-2 text-sm border transition-colors ${
            selectedType === 'digit'
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-gray-300 hover:bg-gray-50'
          }`}
        >
          Digit
        </button>
        <button
          onClick={() => onTypeChange('alphabet')}
          className={`px-4 py-2 text-sm border transition-colors ${
            selectedType === 'alphabet'
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-gray-300 hover:bg-gray-50'
          }`}
        >
          Letter
        </button>
      </div>
    </div>
  );
};

export default TypeSelector;