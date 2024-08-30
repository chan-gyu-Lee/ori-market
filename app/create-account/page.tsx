"use client";

import Button from "@/components/button";
import Input from "@/components/inputs";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { createAccountAction } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function CreateAccount() {
  const [state, action] = useFormState(createAccountAction, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">해당 항목을 기입하여 회원가입해보세요!</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <Input
          name="username"
          required={true}
          type="text"
          placeholder="이름"
          errors={state?.fieldErrors.username}
        />
        <Input
          name="email"
          required={true}
          type="email"
          placeholder="이메일"
          errors={state?.fieldErrors.email}
        />
        <Input
          name="password"
          required={true}
          type="password"
          placeholder="비밀번호"
          errors={state?.fieldErrors.password}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <Input
          required={true}
          name="passwordCheck"
          type="password"
          placeholder="비밀번호 확인"
          errors={state?.fieldErrors.passwordCheck}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <Button text="계정 생성하기!" />
      </form>
      <SocialLogin />
    </div>
  );
}
