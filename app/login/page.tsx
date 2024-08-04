"use client";
import Button from "@/components/button";
import Input from "@/components/inputs";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { handleForm } from "./actions";

export default function Login() {
  const [state, action] = useFormState(handleForm, null);
  console.log(state);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">이메일로 로그인하세요!</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <Input
          name="email"
          required={true}
          type="email"
          placeholder="이메일"
          errors={[]}
        />
        <Input
          name="password"
          required={true}
          type="password"
          placeholder="비밀번호"
          errors={state?.error ?? []}
        />

        <Button text="로그인" />
      </form>
      <SocialLogin />
    </div>
  );
}
