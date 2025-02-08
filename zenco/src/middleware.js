// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
    const { pathname } = req.nextUrl;

    const token = req.cookies.get("jwt");

    // Bỏ qua các tệp tĩnh, hình ảnh và favicon
    if (
        pathname === "/favicon.ico" ||
        pathname.startsWith("/_next/static") ||
        pathname.startsWith("/_next/image") ||
        pathname.match(/\.(jpg|jpeg|png|gif|svg|bmp|webp|tiff|ico)$/)
    ) {
        return NextResponse.next();
    }

    const disallowedPaths = token
        ? []
        : [
              "/checkout",
              "/contact",
              "/docs/contact",
              "/pricing",
              "/auth/auth0/callback",
              "/auth/auth0/login",
              "/auth/jwt/login",
              "/auth/jwt/register",
              "/auth/firebase/login",
              "/auth/firebase/register",
              "/auth/amplify/confirm-register",
              "/auth/amplify/forgot-password",
              "/auth/amplify/login",
              "/auth/amplify/register",
              "/auth/amplify/reset-password",
              "/auth-demo/forgot-password/classic",
              "/auth-demo/forgot-password/modern",
              "/auth-demo/login/classic",
              "/auth-demo/login/modern",
              "/auth-demo/register/classic",
              "/auth-demo/register/modern",
              "/auth-demo/reset-password/classic",
              "/auth-demo/reset-password/modern",
              "/auth-demo/verify-code/classic",
              "/auth-demo/verify-code/modern",
              "/dashboard",
              "/dashboard/academy",
              "/dashboard/account",
              "/dashboard/analytics",
              "/dashboard/blank",
              "/dashboard/blog",
              "/dashboard/calendar",
              "/dashboard/chat",
              "/dashboard/crypto",
              "/dashboard/customers",
              "/dashboard/ecommerce",
              "/dashboard/file-manager",
              "/dashboard/invoices",
              "/dashboard/jobs",
              "/dashboard/kanban",
              "/dashboard/logistics",
              "/dashboard/mail",
              "/dashboard/orders",
              "/dashboard/products",
              "/dashboard/social",
              "/components",
              "/docs",
          ];
    // Kiểm tra và chặn các đường dẫn không cho phép
    if (disallowedPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/404", req.url));
    }

    return NextResponse.next();
}

// Cấu hình middleware để áp dụng cho các đường dẫn nhất định
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
