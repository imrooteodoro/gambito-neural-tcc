import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {

  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;


  const signInURL = new URL('/', request.url);
  const dashboardURL = new URL('/dashboard', request.url);


  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(signInURL);
    }
  }

  if (request.nextUrl.pathname === '/') {
    if (token) {
      return NextResponse.redirect(dashboardURL);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Corresponde a todos os caminhos de requisição exceto:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico (ícone do navegador)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};