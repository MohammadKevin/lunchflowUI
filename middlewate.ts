import {
  NextRequest,
  NextResponse,
} from 'next/server'

export function middleware(
  request: NextRequest,
) {
  const token =
    request.cookies.get(
      'accessToken',
    )?.value

  const pathname =
    request.nextUrl.pathname

  const protectedRoutes = [
    '/dashboard/admin',
    '/dashboard/customer',
    '/dashboard/seller',
  ]

  const isProtectedRoute =
    protectedRoutes.some(
      (route) =>
        pathname.startsWith(
          route,
        ),
    )

  if (
    isProtectedRoute &&
    !token
  ) {
    return NextResponse.redirect(
      new URL(
        '/login',
        request.url,
      ),
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/admin/:path*',
    '/dashboard/customer/:path*',
    '/dashboard/seller/:path*',
  ],
}