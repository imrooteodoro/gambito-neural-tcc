import { NextResponse } from "next/server";
import { BACKEND_URL } from "../interface";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, user_name, email, password, level } = body;

    if (!name || !user_name || !email || !password || !level) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/signup/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        user_name: user_name,
        email: email,
        password: password,
        level: level
      }),
    });

    if (!backendRes.ok) {
      const errorTxt = await backendRes.text();
      console.error("Backend erro:", errorTxt);
      return NextResponse.json(
        { error: "Erro do servidor externo", backend: errorTxt },
        { status: backendRes.status }
      );
    }

    const result = await backendRes.json();

    return NextResponse.json(
      { message: "Usuário criado no backend!", backend: result },
      { status: 201 }
    );

  } catch (error) {
    console.error("Erro no Next API:", error);
    return NextResponse.json(
      { error: "Erro interno no Next" },
      { status: 500 }
    );
  }
}
