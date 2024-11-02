import Link from 'next/link';
import { useAuth, logout } from '@/hooks/auth/useAuth';
import Logo from '/public/logo/logo_row.svg';

const Header = () => {
  /**
   * @todo
   * 1. 로그인 되어있으면 유저 프로필(회원가입 버튼 삭제)
   * 2. 헤더 네비게이션 고민
   * 3. 로고 고민
   */
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (window.location.pathname === '/') return null;
  return (
    <div className="w-full mx-auto border-b-[1px] border-gray-200">
      <div className="max-w-[1200px] flex justify-between p-5 mx-auto">
        <Link href="/activities">
          <Logo />
        </Link>
        <div className="">
          {user ? (
            <div className="flex gap-2">
              <Link href="/mypage">
                <img
                  src={user.profileImageUrl}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
              </Link>
              <p>{user.nickname}</p>
              <button onClick={logout}>로그아웃</button>
            </div>
          ) : (
            <Link href="/auth/login">로그인</Link>
          )}
        </div>
        <Link href="/activities/create/basic">체험등록만들기</Link>
      </div>
    </div>
  );
};

export default Header;
