import { useAuth } from '@/hooks/auth/useAuth';
import Header from '@/components/header/Header';

export default function Login() {
  const { login, user, logout, isLoading } = useAuth();

  const testButton = () => {
    const aaa = async () => {
      login({
        email: 'dbswodbswo@gmail.com',
        password: 'dbswodbswo',
      });
    };
    aaa();
  };

  const testButton2 = () => {
    const aaa = async () => {
      login({
        email: 'ddol9@gmail.com',
        password: 'dPdnjsdPdnjs',
      });
    };
    aaa();
  };

  if (isLoading) return null;

  return (
    <div>
      <Header />
      {user ? (
        <p>{`${user.nickname}님 안녕하세요!`}</p>
      ) : (
        <div>
          <button onClick={testButton}>윤재 로그인</button>
          <button onClick={testButton2}>예원 로그인</button>
        </div>
      )}
      <button onClick={logout}>로그아웃</button>
    </div>
  );
}
