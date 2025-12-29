export const publicRoutes: string[] = ["/", "/about", "/pricing"];

export const authRoutes: string[] = ["/signin", "/signup", "/forgot-password"];

export const apiAuthPrefix: string = "/api/auth";

// 公共 API 路由，不需要认证
export const publicApiRoutes: string[] = [
  "/api/config",
  "/api/webhook",
];

export const DEFAULT_LOGIN_REDIRECT: string = "/";
