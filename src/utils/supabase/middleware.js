import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_DBSUPABASE_URL || "https://dummy.supabase.co",
    process.env.NEXT_PUBLIC_DBSUPABASE_ANON_KEY || "dummy",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const isAuthPage = url.pathname.startsWith('/auth/');
  
  if (!user && !isAuthPage) {
    // If not logged in and not on auth page, redirect to login
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  if (user) {
    const role = user.user_metadata?.role || "member";

    // If user is logged in and visits auth page, redirect to their dashboard
    if (isAuthPage) {
      if (role === "admin") {
        url.pathname = "/admin";
      } else {
        url.pathname = "/";
      }
      return NextResponse.redirect(url);
    }

    // Role-based routing
    if (role === "admin" && !url.pathname.startsWith("/admin")) {
      // Admins should be redirected to admin dashboard if they try to access member pages
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }

    if (role === "member" && url.pathname.startsWith("/admin")) {
      // Members cannot access admin pages
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
