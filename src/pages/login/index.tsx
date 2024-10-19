import { useAuth, logout } from '@/hooks/auth/useAuth';
import Logo from '/public/logo/logo_col.svg';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ErrorResponse } from '@/types/form/error/error';
import { LoginFormData } from '@/types/form/login/loginForm';

// 유효성 검사 규칙
const validationRules = {
  email: {
    required: '이메일은 필수 입력입니다',
    pattern: {
      value:
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
      message: '잘못된 이메일 형식입니다.',
    },
  },
  password: {
    required: '비밀번호는 필수 입력입니다.',
    minLength: {
      value: 8,
      message: '8자 이상 입력해주세요',
    },
  },
};

export default function Login() {
  const { login, user, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormData>({
    mode: 'onSubmit',
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (formData) => {
    login(
      {
        email: formData.email,
        password: formData.password,
      },
      {
        onError: (error) => {
          const err = error as ErrorResponse;
          if (err.response) {
            if (err.response.status === 404) {
              alert('존재하지 않는 이메일입니다.');
            } else if (err.response.status === 400) {
              alert('비밀번호가 일치하지 않습니다.');
            }
          }
        },
      },
    );
  };

  const testButton = () => {
    const aaa = () => {
      login({
        email: 'dbswodbswo@gmail.com',
        password: 'dbswodbswo',
      });
    };
    aaa();
  };

  const testButton2 = () => {
    const aaa = () => {
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
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5 max-w-[800px] mx-auto">
            <div className="flex-col">
              <div>
                <label htmlFor="email">이메일</label>
              </div>
              <div>
                <input
                  className={`border w-full h-14 px-4 ${
                    errors.email
                      ? 'border-red focus:border-red focus:outline-none focus:ring-1 focus:ring-red'
                      : 'border-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                  }`}
                  id="email"
                  type="email"
                  placeholder="이메일을 입력해주세요"
                  {...register('email', validationRules.email)}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-red text-sm">
                  {errors.email.message?.toString()}
                </p>
              )}
            </div>
            <div className="flex-col">
              <div>
                <label htmlFor="password">비밀번호</label>
              </div>
              <div>
                <input
                  className={`border w-full h-14 px-4 ${
                    errors.password
                      ? 'border-red focus:border-red focus:outline-none focus:ring-1 focus:ring-red'
                      : 'border-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                  }`}
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                  {...register('password', validationRules.password)}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-red text-sm">
                  {errors.password.message?.toString()}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
            >
              로그인 하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
