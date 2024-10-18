import { useAuth, logout } from '@/hooks/auth/useAuth';
import Logo from '/public/logo/logo_col.svg';
import { useForm } from 'react-hook-form';

export default function Login() {
  const { login, user, isLoading } = useAuth();

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

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: 'onSubmit',
  });

  const regEmail =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  const FormSubmit = () => {
    // 폼 제출 버튼
    alert('hi');
  };
  if (isLoading) return null;

  return (
    <div>
      {user ? (
        <p>{`${user.nickname}님 안녕하세요!`}</p>
      ) : (
        <div>
          <button onClick={testButton}>윤재 로그인</button>
          <button onClick={testButton2}>예원 로그인</button>
        </div>
      )}
      <button onClick={logout}>로그아웃</button>
      <div>
        <Logo />
      </div>
      <div>
        <form noValidate onSubmit={handleSubmit(FormSubmit)}>
          {/* gap을 적용할 컨테이너에 flex와 gap-5 추가 */}
          <div className="flex flex-col gap-5 max-w-[800px] mx-auto">
            <div className="flex-col">
              <div>
                <label htmlFor="email">이메일</label>
              </div>
              <div>
                <input
                  className="border-gray-500 w-full h-14"
                  id="email"
                  type="email"
                  placeholder="이메일을 입력해주세요"
                  {...register('email', {
                    required: '이메일은 필수 입력입니다',
                    pattern: {
                      value: regEmail,
                      message: '이메일 형식에 맞지 않습니다.',
                    },
                  })}
                />
              </div>
              {errors.email ? <p>{errors.email.message?.toString()}</p> : null}
            </div>
            <div className="flex-col">
              <div>
                <label htmlFor="password">비밀번호</label>
              </div>
              <div>
                <input
                  className="w-full h-14"
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                  {...register('password', {
                    required: '비밀번호는 필수 입력입니다.',
                  })}
                />
              </div>
            </div>
            <button type="submit" disabled={isSubmitting}>
              로그인 하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
