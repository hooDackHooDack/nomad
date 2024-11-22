import { useForm, SubmitHandler } from 'react-hook-form';
import FormInput from '@/components/form/input/FormInput';
import {
  SignUpFormData,
  SignUpResponse,
} from '@/types/form/sign-up/signUpForm';
import { validationRules } from '@/utils/form/validationRules';
import basicApi from '@/lib/axios/basic';
import { AxiosError } from 'axios';
import SubmitButton from '@/components/form/submitButton/SubmitButton';
import SocialBox from '../form/socialBox/SocialBox';
import { alertModal } from '@/utils/alert/alertModal';
import { useRouter } from 'next/router';
import { AUTH_ALERT_MESSAGES } from '../constants/alert/auth';

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
  } = useForm<SignUpFormData>({
    mode: 'onSubmit',
  });
  const password = watch('signupPassword');
  const router = useRouter();
  const onSubmit: SubmitHandler<SignUpFormData> = async (formData) => {
    const { signupEmail, signupNickname, signupPassword } = formData;
    try {
      await basicApi.post<SignUpResponse>('/users', {
        email: signupEmail,
        nickname: signupNickname,
        password: signupPassword,
      });
      alertModal(AUTH_ALERT_MESSAGES.SIGNUP.SUCCESS);
      router.push('/auth/login');
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          alertModal(AUTH_ALERT_MESSAGES.SIGNUP.EMAIL_EXISTS);
        }
      } else {
        alertModal(AUTH_ALERT_MESSAGES.SIGNUP.ERROR);
      }
    }
  };

  const isButtonDisabled = isSubmitting;
  return (
    <div className="flex flex-col max-w-[600px] w-full mx-auto mt-12">
      <h1 className="self-center text-3xl font-bold text-green-dark">
        Sign Up
      </h1>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <FormInput<SignUpFormData>
            label="이메일"
            name="signupEmail"
            type="email"
            register={register}
            error={errors.signupEmail}
            placeholder="이메일을 입력해주세요"
            validationRule={validationRules.email}
          />
          <FormInput<SignUpFormData>
            label="닉네임"
            name="signupNickname"
            type="text"
            register={register}
            error={errors.signupNickname}
            placeholder="닉네임을 입력해주세요"
            validationRule={validationRules.nickname}
          />
          <FormInput<SignUpFormData>
            label="비밀번호"
            name="signupPassword"
            type="password"
            register={register}
            error={errors.signupPassword}
            placeholder="비밀번호를 입력해주세요"
            validationRule={validationRules.password}
          />
          <FormInput<SignUpFormData>
            label="비밀번호 확인"
            name="signupPasswordConfirm"
            type="password"
            register={register}
            error={errors.signupPasswordConfirm}
            placeholder="비밀번호를 한번 더 입력해주세요"
            validationRule={{
              required: '비밀번호 확인은 필수입니다.',
              validate: (value) =>
                value === password || '비밀번호가 일치하지 않습니다.',
            }}
          />
          <SubmitButton disabled={isButtonDisabled} text="회원가입" />
        </div>
      </form>
      <SocialBox
        text={'SNS계정으로 회원가입하기'}
        googleClick={() => {}}
        kakaoClick={() => {}}
      />
    </div>
  );
}
