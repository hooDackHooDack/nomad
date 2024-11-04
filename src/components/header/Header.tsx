/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import { useAuth, logout } from '@/hooks/auth/useAuth';
import Logo from '/public/logo/logo_row.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) return null;
  if (pathname === '/') return null;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-full mx-auto border-b border-gray-200">
      <div className="max-w-[1200px] flex items-center justify-between p-5 mx-auto">
        <Link href="/activities">
          <Logo />
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-900" />
              <div className="w-[1px] h-4 bg-gray-600"></div>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3 border-none">
                  <img
                    src={user.profileImageUrl}
                    alt="profile"
                    className="size-8 rounded-full object-cover"
                  />
                  <span className="font-medium text-gray-600">
                    {user.nickname}
                  </span>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-full">
                  <DropdownMenuItem className="flex items-center justify-center cursor-pointer">
                    <Link href="/mypage">마이 페이지</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center justify-center cursor-pointer">
                    <Link href="/activities/create/basic">체험 등록</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center justify-center cursor-pointer"
                    onClick={handleLogout}
                  >
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className={`${
                  pathname === '/auth/login'
                    ? 'text-green-dark'
                    : 'text-gray-600'
                } hover:text-gray-900`}
              >
                로그인
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
