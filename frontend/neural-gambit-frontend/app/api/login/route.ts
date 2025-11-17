import { NextResponse } from "next/server";
import { BACKEND_URL } from "../interface";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const response = await fetch(`${BACKEND_URL}/signup/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    // Se servidor externo retornar erro
    if (!response.ok) {
      const errorTxt = await response.text();
      console.error("Backend erro:", errorTxt);

      return NextResponse.json(
        {
          error: "Erro do servidor externo",
          backend: errorTxt,
        },
        { status: response.status }
      );
    }

    const result = await response.json();

    const token = result.access_token;
    console.log("Token recebido do backend:", token);
    const tokenType = result.token_type;

    if (!token) {
      return NextResponse.json(
        { error: "Token não retornado pelo backend" },
        { status: 500 }
      );
    }

    const responseWithCookie = NextResponse.json(
      {
        message: "Usuário logado com sucesso!",
        backend: result,
      },
      { status: 200 }
    );

    responseWithCookie.headers.append(
      "Set-Cookie",
      `auth_token=${token}; HttpOnly; Path=/; SameSite=Strict; Secure; Max-Age=3600`
    );

    return responseWithCookie;

  } catch (error) {
    console.error("Erro no Next API:", error);

    return NextResponse.json(
      { error: "Erro interno no Next" },
      { status: 500 }
    );
  }
}
