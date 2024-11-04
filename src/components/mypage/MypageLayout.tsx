/* eslint-disable @next/next/no-img-element */
// pages/mypage/_layout.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import { User, Settings, History, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useRequireAuth } from '@/hooks/auth/useRequireAuth';

const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const currentPath = router.pathname;

  const { user } = useAuth();
  const { user: userLogin, isLoading } = useRequireAuth();

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
      title: '내 체험 관리',
      icon: <Settings className="w-5 h-5" />,
      path: '/mypage/myactivities',
    },
    {
      title: '예약 현황',
      icon: <Calendar className="w-5 h-5" />,
      path: '/mypage/mycalendar',
    },
  ];

  const isActivePath = (path: string) => currentPath === path;

  if (isLoading || !userLogin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full object-cover">
                  {user?.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                  )}
                </div>
                <h2 className="mt-4 font-medium text-lg">{user?.nickname}</h2>
                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>

              <nav className="">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center px-6 py-4 hover:bg-gray-50 transition-colors ${
                      isActivePath(item.path)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="col-span-9">
            <div className="p-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPageLayout;
