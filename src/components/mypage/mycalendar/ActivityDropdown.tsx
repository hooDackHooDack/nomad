import Dropdown from '@/components/Dropdown';
import { ChevronDown } from 'lucide-react';

interface ActivityDropdownProps {
  selectedTitle: string;
  options: { label: string; value: string }[];
  onSelect: (value: string | number) => void;
}

const ActivityDropdown = ({
  selectedTitle,
  options,
  onSelect,
}: ActivityDropdownProps) => {
  return (
    <div className="w-full max-w-xs">
      <Dropdown
        trigger={
          <div className="flex items-center justify-between w-full px-4 py-2 text-sm border rounded-lg bg-white">
            <span>{selectedTitle}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        }
        options={options}
        onSelect={onSelect}
        align="start"
        className="max-h-[240px] overflow-y-auto"
      />
    </div>
  );
};

export default ActivityDropdown;
