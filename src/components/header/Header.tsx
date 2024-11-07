import Link from 'next/link';
import Image from 'next/image';
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
      window.location.href = value;
    }
  };

  return (
    <div className="w-full mx-auto border-b border-gray-200">
      <div className="flex items-center justify-between p-5 mx-auto">
        <Link href="/activities">
          <Logo />
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-900" />
              <div className="w-[1px] h-4 bg-gray-600 sm:hidden"></div>

              <Dropdown
                trigger={
                  <div className="flex items-center gap-3 cursor-pointer">
                    {user.profileImageUrl ? (
                      <Image
                        src={user.profileImageUrl}
                        alt="profile"
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">?</span>
                      </div>
                    )}
                    <span className="font-medium text-gray-600 sm:hidden">
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
