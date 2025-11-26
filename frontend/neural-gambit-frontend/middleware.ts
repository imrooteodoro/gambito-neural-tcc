import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {

  const token = request.cookies.get('access_token')?.value;

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

// 4. Configuração do Matcher: Onde o middleware vai rodar
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