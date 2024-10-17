import Link from 'next/link';
import { useAuth } from '@/hooks/auth/useAuth';

const Header = () => {
  /**
   * @todo
   * 1. 로그인 되어있으면 유저 프로필(회원가입 버튼 삭제)
   * 2. 헤더 네비게이션 고민
   * 3. 로고 고민
   */
  const { user, isLoading, logout } = useAuth();

  if (isLoading) return null;
  return (
    <div className="w-full mx-auto border-b-[1px] border-gray-200">
      <div className="max-w-[1200px] flex justify-between p-5 mx-auto">
        <Link href="/">똘망똘망</Link>
        <div className="flex gap">
          {user ? (
            <div>
              <p>{user.nickname}</p> <button onClick={logout}>로그아웃</button>
            </div>
          ) : (
            <Link href="/login">로그인</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
