/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import { useAuth, logout } from '@/hooks/auth/useAuth';
import Logo from '/public/logo/logo_row.svg';
import Dropdown, { DropdownOption } from '@/components/Dropdown';

const Header = () => {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) return null;
  if (pathname === '/') return null;

  const handleLogout = () => {
    logout();
  };

  const options: DropdownOption[] = [
    { label: '마이 페이지', value: '/mypage' },
    { label: '체험 등록', value: '/activities/create/basic' },
    { label: '로그아웃', value: 'logout' },
  ];

  const handleSelect = (value: string | number) => {
    if (value === 'logout') {
      handleLogout();
    } else if (typeof value === 'string') {
      // 페이지 이동
      window.location.href = value;
    }
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

              <Dropdown
                trigger={
                  <div className="flex items-center gap-3 cursor-pointer">
                    <img
                      src={user.profileImageUrl}
                      alt="profile"
                      className="size-8 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-600">
                      {user.nickname}
                    </span>
                  </div>
                }
                options={options}
                onSelect={handleSelect}
                align="end"
              />
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
