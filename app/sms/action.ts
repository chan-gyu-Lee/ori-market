"use server";

import { redirect } from "next/navigation";
import validator from "validator";
import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "전화번호 형식을 다시 확인해주세요"
  );

const tokenSchema = z.coerce.number().min(100000).max(999999);

interface ActionState {
  token: boolean;
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
  // 두 단계 프로세스로 나뉨
  const phone = formData.get("phone");
  const token = formData.get("token");
  // 1. 핸드폰 번호를 입력하고 그게 맞으면 토큰을 생성
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      return {
        token: true,
      };
    }
    // 2. 유저는 알맞은 토큰을 입력하면 정상적으로 로그인됨.
  } else {
    const result = tokenSchema.safeParse(token);
    if (!result.success) {
      return {
        token: true,
      };
    } else {
      // 로그인 시켜야함
      redirect("/");
    }
  }
}
