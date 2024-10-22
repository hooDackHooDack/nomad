import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import FormInput from '@/components/form/input/FormInput';
import {
  SignUpFormData,
  SignUpResponse,
} from '@/types/form/sign-up/signUpForm';
import { validationRules } from '@/utils/form/validationRules';
import basicApi from '@/components/lib/axios/basic';
import { AxiosError } from 'axios';
import SubmitButton from '@/components/form/submitButton/SubmitButton';
import SocialBox from '../form/socialBox/SocialBox';

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
  } = useForm<SignUpFormData>({
    mode: 'onSubmit',
  });
  const password = watch('password');

  const onSubmit: SubmitHandler<SignUpFormData> = async (formData) => {
    const { email, nickname, password } = formData;
    try {
      await basicApi.post<SignUpResponse>('/users', {
        email,
        nickname,
        password,
      });
      alert(`회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          alert('이미 가입된 이메일입니다.');
          return;
        }
        alert(
          error.response?.data?.message || '회원가입 중 오류가 발생했습니다.',
        );
      } else {
        alert('회원가입 중 오류가 발생했습니다.');
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
            name="email"
            type="email"
            register={register}
            error={errors.email}
            placeholder="이메일을 입력해주세요"
            validationRule={validationRules.email}
          />
          <FormInput<SignUpFormData>
            label="닉네임"
            name="nickname"
            type="text"
            register={register}
            error={errors.nickname}
            placeholder="닉네임을 입력해주세요"
            validationRule={validationRules.nickname}
          />
          <FormInput<SignUpFormData>
            label="비밀번호"
            name="password"
            type="password"
            register={register}
            error={errors.password}
            placeholder="비밀번호를 입력해주세요"
            validationRule={validationRules.password}
          />
          <FormInput<SignUpFormData>
            label="비밀번호 확인"
            name="passwordConfirm"
            type="password"
            register={register}
            error={errors.passwordConfirm}
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
