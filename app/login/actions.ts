"use server";
import {
  PASSWORD_ERROR,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REG,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
// 이메일 있는지 확인
const checkExistEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  });

  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string()
    .email()
    .trim()
    .refine(checkExistEmail, "존재하는 이메일이 아닙니다."),
  password: z.string().min(PASSWORD_MIN_LENGTH).trim(),
  // .regex(PASSWORD_REG, PASSWORD_ERROR),
});

export const login = async (prevData: any, formData: FormData) => {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    console.log("이거=> ", result.error.flatten());
    return result.error.flatten();
  } else {
    // 비밀번호 체크
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    const ok = await bcrypt.compare(result.data.password, user!.password ?? "");

    // 로그인 => 쿠키생성
    if (ok) {
      const session = await getSession();
      session.id = user!.id;
      session.save();
      // 프로필 이미지로 이동
      redirect("/profile");
    } else {
      return {
        fieldErrors: {
          password: ["비밀번호를 다시 확인해주세요"],
          email: [""],
        },
      };
    }
  }
};
