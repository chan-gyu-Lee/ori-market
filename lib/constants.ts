export const PASSWORD_MIN_LENGTH = 4;
export const PASSWORD_REG = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/
);
export const PASSWORD_ERROR =
  "비밀번호는 영어 소대문자, 숫자, 특문이 있어야돼!";
