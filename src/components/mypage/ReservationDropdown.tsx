import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { RESERVATION_STATUS } from '@/pages/mypage/reservations';

interface StatusDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const StatusDropdown = ({ value, onChange }: StatusDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-[140px]"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>
          {value ? RESERVATION_STATUS[value as keyof typeof RESERVATION_STATUS] : '전체'}
        </span>
        <ChevronDown 
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-full rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <ul>
            <li
              role="option"
              aria-selected={value === ''}
              onClick={() => handleSelect('')}
              className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
            >
              <span>전체</span>
              {value === '' && <Check className="h-4 w-4 text-green-500" />}
            </li>
            {Object.entries(RESERVATION_STATUS).map(([key, label]) => (
              <li
                key={key}
                role="option"
                aria-selected={value === key}
                onClick={() => handleSelect(key)}
                className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
              >
                <span>{label}</span>
                {value === key && <Check className="h-4 w-4 text-green-500" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;