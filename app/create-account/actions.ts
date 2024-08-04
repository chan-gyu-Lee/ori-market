"use server";
import { z } from "zod";

const checkUsername = (username: string) => {
  return !username.includes("오리");
};

interface ICheckPasswordSame {
  password: string;
  passwordCheck: string;
}

const checkPasswordSame = ({ password, passwordCheck }: ICheckPasswordSame) => {
  console.log(password, passwordCheck);

  return password === passwordCheck;
};

const passwordRegex = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/
);

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
    password: z
      .string()
      .min(4)
      .trim()
      .regex(passwordRegex, "비밀번호는 영어 소대문자, 숫자, 특문이 있어야돼!"),
    passwordCheck: z.string().min(4).trim(),
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
  console.log(data);

  const result = formSchema.safeParse(data);
  console.log(result);
  if (!result.success) {
    console.log(result.data);
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
