import { useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

export interface Option {
  id: string | number;
  label: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  selectedOptions: Option[];
  onChange: (selected: Option[]) => void;
  placeholder?: string;
}

export default function MultiSelectDropdown({ 
  options, 
  selectedOptions, 
  onChange,
  placeholder = "Select"
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const toggleOption = (option: Option) => {
    if (selectedOptions.some(item => item.id === option.id)) {
      onChange(selectedOptions.filter(item => item.id !== option.id));
    } else {
      onChange([...selectedOptions, option]);
    }
  };
  
  const removeOption = (option: Option, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropdown from toggling
    onChange(selectedOptions.filter(item => item.id !== option.id));
  };
  
  return (
    <div className="w-full">
      {/* Dropdown trigger with selected options inside */}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm text-left min-h-10"
        >
          <div className="flex flex-wrap gap-1 items-center flex-1 mr-2">
            {selectedOptions.length > 0 ? (
              selectedOptions.map(option => (
                <div 
                  key={option.id} 
                  className="flex items-center bg-blue-500 text-white px-2 py-1 rounded-lg text-sm my-1"
                >
                  {option.label}
                  <button 
                    onClick={(e) => removeOption(option, e)} 
                    className="ml-1 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            ) : (
              <span className="text-gray-700">{placeholder}</span>
            )}
          </div>
          <ChevronDown size={20} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
            <ul>
              {options.map(option => (
                <li 
                  key={option.id} 
                  onClick={() => toggleOption(option)}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                    selectedOptions.some(item => item.id === option.id) 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700'
                  } ${option.id === options[0].id ? 'rounded-t-xl' : ''} ${option.id === options[options.length - 1].id ? 'rounded-b-xl' : ''}`}
                >
                  <span>{option.label}</span>
                  {selectedOptions.some(item => item.id === option.id) && (
                    <Check size={16} className="text-blue-500" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}