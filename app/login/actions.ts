"use server";
export const handleForm = async (prevData: any, data: FormData) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log(prevData);

  console.log("서버입니다", data.get("email"));
  return { error: ["에러"] };
};
