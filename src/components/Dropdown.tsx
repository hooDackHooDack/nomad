import { useState, useRef, useEffect } from 'react';

interface DropdownOption {
  label: string;
  value: string | number;
}

interface DropdownProps {
  trigger: React.ReactNode;
  options: DropdownOption[];
  onSelect: (value: string | number) => void;
  align?: 'start' | 'end' | 'center';
  className?: string;
}

const Dropdown = ({
  trigger,
  options,
  onSelect,
  align = 'end',
  className = '',
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: string | number) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute mt-1 rounded-lg border border-gray-200 bg-white py-1 shadow-lg ${
            align === 'end'
              ? 'right-0'
              : align === 'center'
              ? 'left-1/2 -translate-x-1/2'
              : 'left-0'
          } ${className}`}
        >
          {options.map((option) => (
            <DropdownItem
              key={option.value}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </DropdownItem>
          ))}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <div
      className={`px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Dropdown;