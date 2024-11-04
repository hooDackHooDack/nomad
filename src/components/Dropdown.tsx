import { useState, useRef, useEffect } from 'react';

/**
 * @component Dropdown
 * @param trigger - 버튼, 아이콘 등
 * @param options - 드롭다운에 표시될 목록, { label, value }
 * @param onSelect - 옵션 선택된 값 전달
 * @param align - 드롭다운 정렬
 * @param className - 스타일 추가
 *
 * @example
 * // 사용 예시
 * const options = [
 *   { label: '옵션 1', value: 'option1' },
 *   { label: '옵션 2', value: 'option2' },
 * ];
 *
 * <Dropdown
 *   trigger={<button>드롭다운 열기</button>}
 *   options={options}
 *   onSelect={(value) => console.log('선택된 값:', value)}
 *   align="start"
 * />
 */

export interface DropdownOption {
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
          className={`absolute mt-1 rounded-lg border border-gray-200 bg-white py-1 shadow-lg min-w-[120px] w-full z-50 ${
            align === 'end'
              ? 'right-0'
              : align === 'center'
                ? 'left-1/2 -translate-x-1/2'
                : 'left-0'
          } ${className}`}
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="px-4 py-2.5 text-sm text-gray-800 text-center hover:bg-gray-100 cursor-pointer"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
