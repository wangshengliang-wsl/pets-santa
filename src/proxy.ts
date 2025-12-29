import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import createIntlMiddleware from 'next-intl/middleware';

import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
  publicApiRoutes,
} from "./routes";
import { routing } from "./i18n/routing";

// 创建 i18n 中间件
const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 检查是否是 API 路由或静态资源
  const isApiRoute = pathname.startsWith('/api');
  const isStaticAsset = /\.(.*)$/.test(pathname) || pathname.startsWith('/_next');

  // API 路由和静态资源不需要 i18n 处理
  if (isApiRoute || isStaticAsset) {
    const session = getSessionCookie(request);

    const isApiAuth = pathname.startsWith(apiAuthPrefix);
    const isPublicApiRoute = publicApiRoutes.some((route) => pathname.startsWith(route));

    // API 认证路由直接通过
    if (isApiAuth) {
      return NextResponse.next();
    }

    // 公共 API 路由直接通过
    if (isPublicApiRoute) {
      return NextResponse.next();
    }

    return NextResponse.next();
  }

  // 对于页面路由，先运行 i18n 中间件
  const intlResponse = intlMiddleware(request);

  // 提取 locale 和真实路径
  const localeMatch = pathname.match(/^\/(en|zh)(\/.*)?$/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
  const pathWithoutLocale = localeMatch ? (localeMatch[2] || '/') : pathname;

  // 获取 session
  const session = getSessionCookie(request);

  // 检查是否是公共路由
  const isPublicRoute = publicRoutes.includes(pathWithoutLocale);

  // 检查是否是认证路由
  const isAuthRoute = authRoutes.some((path) => pathWithoutLocale.startsWith(path));

  if (isAuthRoute) {
    if (session) {
      // 已登录用户访问认证路由，重定向到首页
      const redirectUrl = new URL(`/${locale}${DEFAULT_LOGIN_REDIRECT}`, request.url);
      return NextResponse.redirect(redirectUrl);
    }
    return intlResponse;
  }

  if (!session && !isPublicRoute) {
    // 未登录用户访问受保护路由，重定向到登录页
    const redirectUrl = new URL(`/${locale}/signin`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return intlResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
