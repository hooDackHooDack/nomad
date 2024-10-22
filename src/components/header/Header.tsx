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
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex gap">
          {user ? (
            <div>
              <p>{user.nickname}</p> <button onClick={logout}>로그아웃</button>
            </div>
          ) : (
            <Link href="/auth">로그인</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
