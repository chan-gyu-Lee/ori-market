"use client";
import Button from "@/components/button";
import Input from "@/components/inputs";
import { useFormState } from "react-dom";
import { smsLogin } from "./action";

const initData = {
  token: false,
  error: undefined,
};
export default function SMSLogin() {
  const [state, dispatch] = useFormState(smsLogin, initData);
  console.log(state.token);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS 로그인</h1>
        <h2 className="text-xl">핸드폰 번호로 로그인하세요!</h2>
      </div>
      <form className="flex flex-col gap-3" action={dispatch}>
        <Input
          name="phone"
          required={true}
          type="text"
          placeholder="핸드폰 전화번호"
          errors={state.error?.formErrors}
          disabled={state.token}
        />
        {state.token && (
          <Input
            name="token"
            required={true}
            type="number"
            placeholder="인증번호"
            min={100000}
            max={999999}
            errors={[]}
          />
        )}

        <Button text={state.token ? "토큰 인증하기" : "인증 문자 보내기"} />
      </form>
    </div>
  );
}
