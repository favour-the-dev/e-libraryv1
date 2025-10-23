import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const {pathname} = request.nextUrl;

    const isAuthPage = pathname.startsWith('/register') 
    || pathname.startsWith('/signin') 
    || pathname === "/";

    if (!token && !isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if(token && isAuthPage) {
        if(token.role === 'admin') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }else if(token.role === 'user') {
            return NextResponse.redirect(new URL('/reader/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)",
  ],
};
