import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6">
      <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
        <span className="text-9xl">🦆</span>
        <h1 className="text-4xl">오리</h1>
        <h2 className="text-2xl">오리 마켓에 어서오세요!</h2>
      </div>
      <div className="flex flex-col items-center gap-3 w-full">
        <Link
          href={"/create-account"}
          className="w-full bg-orange-500 text-white text-lg font-medium py-2.5 rounded-md text-center"
        >
          회원가입
        </Link>
        <div className="flex justify-center items-center gap-3">
          <span className="flex gap-2">이미 계정이 있나요?</span>
          <Link href={"/login"} className="hover:underline underline-offset-4">
            로그인{" "}
          </Link>
        </div>
      </div>
    </div>
  );
}
