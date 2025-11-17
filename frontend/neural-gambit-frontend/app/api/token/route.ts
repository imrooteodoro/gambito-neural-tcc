import { NextResponse } from "next/server";
import { BACKEND_URL } from "../interface";

export async function POST(req: Request) {
  try {
    const { token } = await req.json(); // <-- importante

    if (!token) {
      return NextResponse.json(
        { error: "Token não enviado." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${BACKEND_URL}/signup/auth/activate?token=${encodeURIComponent(token)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    if (!response.ok) {
      const txt = await response.text();
      return NextResponse.json(
        { error: "Erro no backend", backend: txt },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json(
      { message: "Usuário ativado com sucesso!", backend: result },
      { status: 200 }
    );
  }
  catch (error) {
    console.error("Erro Next:", error);
    return NextResponse.json(
      { error: "Erro interno no Next" },
      { status: 500 }
    );
  }
}
