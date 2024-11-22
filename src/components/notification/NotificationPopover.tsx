import { Bell } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationList } from './NotificationList';
import { useNotifications } from '@/hooks/notification/useNotifications';

export const NotificationPopover = () => {
  const { 
    notifications, 
    isLoading, 
    totalCount,
    isOpen,
    togglePopover,
    handleDelete,
    loadMore,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications();

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={togglePopover}>
        <PopoverTrigger>
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-900" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-DEFAULT text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {totalCount > 99 ? '99+' : totalCount}
              </span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <div className="flex flex-col">
            <div className="p-4">
              <h3 className="font-semibold">알림 {totalCount}개</h3>
            </div>
            <NotificationList
              notifications={notifications}
              isLoading={isLoading}
              onDelete={handleDelete}
              onLoadMore={loadMore}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};