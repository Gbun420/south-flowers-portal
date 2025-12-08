import { createServerClient, CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set(name, value, options)
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set(name, '', options)
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // Redirect unauthenticated users from protected routes
  if (!session && (pathname.startsWith('/dashboard') || pathname.startsWith('/staff') || pathname.startsWith('/admin'))) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  // Role-based access control for authenticated users
  if (session) {
    // Get user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    const userRole = profile?.role

    // Protect staff routes - only staff, admin, and master_admin can access
    if (pathname.startsWith('/staff') && !['staff', 'admin', 'master_admin'].includes(userRole)) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/dashboard'
      return NextResponse.redirect(redirectUrl)
    }

    // Protect admin routes - only admin and master_admin can access
    if (pathname.startsWith('/admin') && !['admin', 'master_admin'].includes(userRole)) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/dashboard'
      return NextResponse.redirect(redirectUrl)
    }

    // Protect master admin routes - only master_admin can access
    if (pathname.startsWith('/admin/master') && userRole !== 'master_admin') {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/staff/dashboard'
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /login (login page itself)
     * - /auth (Supabase auth callback)
     * - / (landing page)
     * - Any other public assets or API routes you want to exclude
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|auth|).*)',
    '/dashboard/:path*',
    '/staff/:path*', // Protect staff routes
    '/admin/:path*', // Protect admin routes
  ],
}
