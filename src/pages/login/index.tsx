import { useAuth } from '@/hooks/auth/useAuth';
import Logo from '/public/logo/logo_col.svg';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ErrorResponse } from '@/types/form/error/error';
import { LoginFormData } from '@/types/form/login/loginForm';
import { validationRules } from '@/utils/form/validationRules';
import SocialBox from '@/components/form/socialBox/SocialBox';
import AuthSwitcher from '@/components/form/authSwitcher/AuthSwitcher';
import FormInput from '@/components/form/input/FormInput';
import { useRouter } from 'next/router';

export default function Login() {
  const { login, user, isLoading, isLoginLoading } = useAuth();
  const router = useRouter();
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

  if (isLoading) return null;
  if (user) router.push('/');

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
            <FormInput<LoginFormData>
              label="이메일"
              name="email"
              type="email"
              register={register}
              error={errors.email}
              placeholder="이메일을 입력해주세요"
              validationRule={validationRules.email}
            />
            <FormInput<LoginFormData>
              label="비밀번호"
              name="password"
              type="password"
              register={register}
              error={errors.password}
              placeholder="비밀번호를 입력해주세요"
              validationRule={validationRules.password}
            />
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
          link="/sign-up"
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
