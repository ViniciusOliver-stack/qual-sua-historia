import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register");
    const isProtectedPage =
      req.nextUrl.pathname.startsWith("/dashboard") ||
      req.nextUrl.pathname.startsWith("/profile");

    // Se o usuário está logado e tenta acessar páginas de auth (login/register)
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Se o usuário não está logado e tenta acessar páginas protegidas
    if (isProtectedPage && !isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => {
        // Retorna true para permitir que o middleware funcione para todas as rotas
        // O controle de acesso é feito na função middleware acima
        return true;
      },
    },
  }
);

export const config = {
  // Matcher para todas as rotas que precisam de verificação de auth
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login", "/register"],
};
