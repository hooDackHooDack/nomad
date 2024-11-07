/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useRouter } from 'next/router';
import { User, Settings, History, Calendar, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useRequireAuth } from '@/hooks/auth/useRequireAuth';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navigationItems = [
  {
    title: '내 정보',
    icon: <User className="w-5 h-5" />,
    path: '/mypage',
  },
  {
    title: '예약 내역',
    icon: <History className="w-5 h-5" />,
    path: '/mypage/reservations',
  },
  {
    title: '체험 관리',
    icon: <Settings className="w-5 h-5" />,
    path: '/mypage/myactivities',
  },
  {
    title: '예약 현황',
    icon: <Calendar className="w-5 h-5" />,
    path: '/mypage/mycalendar',
  },
];

const SideNav = ({ currentPath }: { currentPath: string }) => {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow lg:p-8 md:px-2 py-4">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden">
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-full" />
          )}
        </div>
        <h2 className="mt-4 font-medium text-lg">{user?.nickname}</h2>
        <p className="text-gray-500 text-sm">{user?.email}</p>
      </div>

      <nav className="space-y-2">
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center px-4 py-4 rounded-lg transition-colors ${
              currentPath === item.path
                ? 'text-green-dark'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {item.icon}
            <span className="ml-3">{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

const MobileNav = ({ currentPath }: { currentPath: string }) => {
  const { user } = useAuth();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2 hover:bg-gray-100 rounded-lg border-none">
          <Menu className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <div className="flex flex-col h-full bg-white">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-full" />
                )}
              </div>
              <div>
                <h2 className="font-medium">{user?.nickname}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-4 py-3 rounded-lg mb-2 transition-colors ${
                  currentPath === item.path
                    ? 'text-green-dark'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const currentPath = router.pathname;
  const { user: userLogin, isLoading } = useRequireAuth();

  if (isLoading || !userLogin) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-144px)] bg-gray-50 py-8">
      <div
        className="mx-auto px-4 
        sm:max-w-[743px] 
        md:max-w-[1919px] md:px-6 
        lg:max-w-[1920px] lg:px-8"
      >
        <div className="flex justify-between items-center mb-6 md:hidden">
          <MobileNav currentPath={currentPath} />
          <h1 className="text-2xl font-bold">
            {navigationItems.find((item) => item.path === currentPath)?.title}
          </h1>
          <div className="w-8" />
        </div>

        <div
          className="grid grid-cols-1 gap-8 
          sm:grid-cols-1
          md:grid-cols-12"
        >
          <div className="hidden md:block md:col-span-3">
            <SideNav currentPath={currentPath} />
          </div>
          <div className="md:col-span-9">
            <div className="p-6 sm:p-2">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPageLayout;
