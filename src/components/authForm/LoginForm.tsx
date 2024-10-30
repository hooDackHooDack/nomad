import { useAuth } from '@/hooks/auth/useAuth';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ErrorResponse } from '@/types/form/error/error';
import { LoginFormData } from '@/types/form/login/loginForm';
import { validationRules } from '@/utils/form/validationRules';
import FormInput from '@/components/form/input/FormInput';
import { useRouter } from 'next/router';
import SubmitButton from '@/components/form/submitButton/SubmitButton';
import SocialBox from '../form/socialBox/SocialBox';
import { alertModal } from '@/utils/alert/alertModal';

export default function LoginForm() {
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
        email: formData.loginEmail,
        password: formData.loginPassword,
      },
      {
        onError: (error) => {
          const err = error as ErrorResponse;
          if (err.response) {
            if (err.response.status === 404) {
              alertModal({
                text: '존재하지 않는 이메일 입니다.',
                icon: 'warning',
                confirmButtonText: '확인',
                timer: 2400,
              });
            } else if (err.response.status === 400) {
              alertModal({
                text: '비밀번호가 일치하지 않습니다.',
                icon: 'warning',
                confirmButtonText: '확인',
                timer: 2400,
              });
            }
          }
        },
      },
    );
  };

  if (isLoading) return null;
  if (user) router.push('/activities');

  return (
    <div className="w-full flex flex-col">
      <h1 className="self-center text-3xl font-bold text-green-dark">
        Sign In
      </h1>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-7">
          <FormInput<LoginFormData>
            label="이메일"
            name="loginEmail"
            type="email"
            register={register}
            error={errors.loginEmail}
            placeholder="이메일을 입력해주세요"
            validationRule={validationRules.email}
          />
          <FormInput<LoginFormData>
            label="비밀번호"
            name="loginPassword"
            type="password"
            register={register}
            error={errors.loginPassword}
            placeholder="비밀번호를 입력해주세요"
            validationRule={validationRules.password}
          />
          <SubmitButton disabled={isButtonDisabled} text="로그인" />
        </div>
      </form>
      <SocialBox
        text={'SNS계정으로 로그인하기'}
        googleClick={() => {}}
        kakaoClick={() => {}}
      />
    </div>
  );
}
