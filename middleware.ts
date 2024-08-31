import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface IPublicOnlyUrls {
  [key: string]: boolean;
}

const publicOnlyUrls: IPublicOnlyUrls = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();

  const exist = publicOnlyUrls[request.nextUrl.pathname];
  // 로그인이 안되었으면 publicOnlyUrls를 제외하고 입장 불가
  if (!session.id) {
    if (!exist) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // 로그인이 되었으면 publicOnlyUrls 입장 불가
  } else if (session.id) {
    if (exist) {
      return NextResponse.redirect(new URL("/products", request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
