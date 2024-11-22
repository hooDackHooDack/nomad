import { X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {ko} from "date-fns/locale";
import { Notification } from '@/types/notification/notification';

interface NotificationItemProps {
  notification: Notification;
  onDelete: (id: number) => void;
}

export const NotificationItem = ({
  notification,
  onDelete,
}: NotificationItemProps) => {
  const highlightKeywords = (content: string) => {
    const parts = content.split(/(승인|거절)/);
    console.log(parts);
    return parts.map((part, index) => {
      if (part === '승인') {
        return (
          <span key={index} className="text-blue">
            {part}
          </span>
        );
      }
      if (part === '거절') {
        return (
          <span key={index} className="text-red">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="p-4 border-b border-gray-100 hover:bg-gray-50 flex justify-between items-start">
      <div className="flex flex-col gap-1 pr-2">
        <p className="text-sm text-gray-800">
          {highlightKeywords(notification.content)}
        </p>
        <span className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(notification.createdAt), {
            locale: ko,
            addSuffix: true,
          })}
        </span>
      </div>
      <button
        onClick={() => onDelete(notification.id)}
        className="text-gray-400 hover:text-gray-600 border-none"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
