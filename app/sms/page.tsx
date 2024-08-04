import Button from "@/components/button";
import Input from "@/components/inputs";

export default function SMSLogin() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS 로그인</h1>
        <h2 className="text-xl">핸드폰 번호로 로그인하세요!</h2>
      </div>
      <form className="flex flex-col gap-3">
        <Input
          name="phoneNumber"
          required={true}
          type="number"
          placeholder="핸드폰 전화번호"
          errors={[]}
        />
        <Input
          name="varifyNumber"
          required={true}
          type="number"
          placeholder="인증번호"
          errors={[]}
        />
        <Button text="인증하기!" />
      </form>
    </div>
  );
}
