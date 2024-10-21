import { useAuth } from '@/hooks/auth/useAuth';
import Logo from '/public/logo/logo_col.svg';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ErrorResponse } from '@/types/form/error/error';
import { LoginFormData } from '@/types/form/login/loginForm';
import { useState } from 'react';
import OpenEye from '/public/icons/input/visibility_on.svg';
import CloseEye from '/public/icons/input/visibility_off.svg';
import { validationRules } from '@/utils/form/validationRules';
import SocialBox from '@/components/form/socialBox/SocialBox';
import AuthSwitcher from '@/components/form/authSwitcher/AuthSwitcher';

export default function Login() {
  const { login, user, isLoading, isLoginLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormData>({
    mode: 'onSubmit',
  });
  const isButtonDisabled = isSubmitting || isLoginLoading;

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

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  if (isLoading) return null;

  return (
    <div>
      {user ? null : (
        <div className="flex justify-around mt-2">
          <button onClick={testButton} className="rounded-full w-16 h-16 p-2">
            윤재
          </button>
          <button onClick={testButton2} className="rounded-full w-16 h-16 p-2">
            예원
          </button>
        </div>
      )}

      <div className="flex flex-col max-w-[600px] mx-auto mt-12">
        <Logo className="self-center" />
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-7 mt-14">
            <div className="flex-col">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-lg font-regular text-black"
                >
                  이메일
                </label>
                <input
                  className={`border w-full h-14 px-4 ${
                    errors.email
                      ? 'border-red focus:border-red focus:outline-none focus:ring-1 focus:ring-red'
                      : 'border-gray-500 focus:border-green-dark focus:outline-none focus:ring-1 focus:ring-green-dark'
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
              <div className="flex flex-col gap-2 relative">
                <label
                  htmlFor="password"
                  className="text-lg font-regular text-black"
                >
                  비밀번호
                </label>
                <input
                  className={`border w-full h-14 px-4 ${
                    errors.password
                      ? 'border-red focus:border-red focus:outline-none focus:ring-1 focus:ring-red'
                      : 'border-gray-500 focus:border-green-dark focus:outline-none focus:ring-1 focus:ring-green-dark'
                  }`}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력해주세요"
                  {...register('password', validationRules.password)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-[60px] transform -translate-y-1/2 cursor-pointer border-none"
                >
                  {showPassword ? <OpenEye /> : <CloseEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-red text-sm">
                  {errors.password.message?.toString()}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isButtonDisabled}
              className="bg-green-dark text-gray-50 text-lg font-bold py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
              로그인 하기
            </button>
          </div>
        </form>
        <AuthSwitcher
          text="회원이 아니신가요?"
          link="/#"
          linkText="회원가입하기"
        />
        <SocialBox
          text={'SNS계정으로 로그인하기'}
          googleClick={() => {}}
          kakaoClick={() => {}}
        />
      </div>
    </div>
  );
}
