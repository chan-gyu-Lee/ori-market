import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // 1. github oauth에서 준 code 받음
  const code = request.nextUrl.searchParams.get("code");
  // code가 없다면 notFound 페이지로 리턴
  if (!code) {
    return notFound();
  }

  // 2. 받은 code를 accessToken으로 교환
  const accessTokenUrl = "https://github.com/login/oauth/access_token";
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code: code,
  };
  const formattedParams = new URLSearchParams(params).toString();
  const finalUrl = `${accessTokenUrl}?${formattedParams}`;
  const { error, access_token } = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: { Accept: "application/json" },
    })
  ).json();

  // 2-1 : 에러 발생 시
  // 코드가 만료되면 에러가 발생하는데 그걸 확인
  if (error) {
    return new Response(null, {
      status: 400,
    });
  }

  // 2-2 : accessToken이 정상적으로 왔다면 user profile 요청
  const { id, avatar_url, login } = await (
    await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      // 모든 유저가 캐시되면 안되기때문에 no cache를 한다
      cache: "no-cache",
    })
  ).json();

  // 가입한 유저인지 찾고 아니면 가입
  const user = await db.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: {
      id: true,
    },
  });

  if (user) {
    const session = await getSession();
    session.id = user.id;
    await session.save();
    return redirect("/profile");
  }

  // 가입시키기
  const newUser = await db.user.create({
    data: {
      github_id: id + "",
      avatar: avatar_url,
      username: login,
    },
    select: {
      id: true,
    },
  });

  const session = await getSession();
  session.id = newUser.id;
  await session.save();
  return redirect("/profile");
}
