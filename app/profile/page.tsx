"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";

async function getUser() {
  const session = await getSession();
  // 세션에 아이디가 있다면 db에서 가져옴
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) return user;
    else notFound();
  } else {
    notFound();
  }
}

export default async function Profile() {
  const user = await getUser();
  const logOut = async () => {
    "use server";
    const session = await getSession();
    session.destroy();
    redirect("/");
  };
  return (
    <div>
      <h1>여기는 {user?.username}님의 프로필 페이지입니다.</h1>
      <form action={logOut}>
        <button>로그아웃</button>
      </form>
    </div>
  );
}
