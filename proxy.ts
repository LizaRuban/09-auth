import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';
import { checkServerSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isPrivateRoute = privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isPublicRoute && !isPrivateRoute) {
    return NextResponse.next();
  }

  // Якщо accessToken існує
  if (accessToken) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  }

  // Якщо accessToken відсутній, але є refreshToken
  if (refreshToken) {
    try {
      const data = await checkServerSession();
      const setCookie = data.headers['set-cookie'];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        const parsedCookies = cookieArray
          .map((cookieStr) => parseSetCookie(cookieStr))
          .filter((cookie) => cookie.value !== undefined);

        const hasAccessToken = parsedCookies.some(
          (cookie) =>
            cookie.name === 'accessToken' &&
            cookie.value !== undefined &&
            cookie.value !== ''
        );

        if (hasAccessToken) {
          // Оновлюємо cookies поточного запиту
          for (const parsed of parsedCookies) {
            if (parsed.value === undefined) continue;

            cookieStore.set(parsed.name, parsed.value, {
              path: parsed.path ?? '/',
              domain: parsed.domain,
              httpOnly: parsed.httpOnly,
              secure: parsed.secure,
              sameSite: parsed.sameSite,
              expires: parsed.expires,
              maxAge: parsed.maxAge,
            });
          }

          let response: NextResponse;

          // Авторизований користувач на публічному маршруті
          if (isPublicRoute) {
            response = NextResponse.redirect(new URL('/', request.url));
          } else {
            // Передаємо оновлені cookies серверним компонентам
            const requestHeaders = new Headers(request.headers);

            requestHeaders.set('Cookie', cookieStore.toString());

            response = NextResponse.next({
              request: {
                headers: requestHeaders,
              },
            });
          }

          // Передаємо оновлені cookies браузеру
          for (const parsed of parsedCookies) {
            if (parsed.value === undefined) continue;

            response.cookies.set(parsed.name, parsed.value, {
              path: parsed.path ?? '/',
              domain: parsed.domain,
              httpOnly: parsed.httpOnly,
              secure: parsed.secure,
              sameSite: parsed.sameSite,
              expires: parsed.expires,
              maxAge: parsed.maxAge,
            });
          }

          return response;
        }
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
    }
  }

  // Якщо токенів немає або оновлення сесії не вдалося
  if (isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Неавторизованим користувачам дозволено
  // відкривати сторінки входу та реєстрації
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
