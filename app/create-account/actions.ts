"use server";
import {
  PASSWORD_ERROR,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REG,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";

import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkUsername = (username: string) => {
  return !username.includes("오리");
};

interface ICheckPasswordSame {
  password: string;
  passwordCheck: string;
}

// 패스워드 일치 확인
const checkPasswordSame = ({ password, passwordCheck }: ICheckPasswordSame) => {
  return password === passwordCheck;
};

// email 중복확인
const checkUniqueEmail = async (email: string, ctx: z.RefinementCtx) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  if (user) {
    ctx.addIssue({
      code: "custom",
      message: "중복된 이메일입니다.",
      path: ["email"],
      fatal: true,
    });
    return z.NEVER;
  }
};

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "이름을 글자",
        required_error: "필수값!",
      })
      .min(2, "너무 짧아!")
      .max(10, "너무 길어!")
      .trim()
      .refine(checkUsername, "오리는 내꺼야!"),
    email: z.string().email().trim(),
    password: z.string().min(PASSWORD_MIN_LENGTH).trim(),
    //  .regex(PASSWORD_REG, PASSWORD_ERROR),
    passwordCheck: z.string().min(4).trim(),
  })
  .superRefine(async ({ email }, ctx) => {
    await checkUniqueEmail(email, ctx);
  })
  .refine(checkPasswordSame, {
    message: "비밀번호가 일치하지 않아요!",
    path: ["password"],
  });

const usernameSchema = z.string().min(2).max(10);

export async function createAccountAction(prevData: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordCheck: formData.get("passwordCheck"),
  };

  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    // db 저장
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
    // 로그인 시켜주고 홈으로 리다이렉트
    const session = await getSession();

    session.id = user.id;
    await session.save();

    redirect("/profile");
  }
}
