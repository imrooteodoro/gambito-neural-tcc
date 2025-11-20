import { NextResponse } from "next/server";
import { BACKEND_URL } from "../interface";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    console.log("TOKEN DO COOKIE:", token);

    if (!token) {
      return NextResponse.json(
        { error: "Token não encontrado" },
        { status: 401 }
      );
    }
    const response = await fetch(`${BACKEND_URL}/auth/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const backendError = await response.text();
      console.error("ERRO BACKEND:", backendError);
      return NextResponse.json(
        { error: "Erro no backend", backend: backendError },
        { status: response.status }
      );
    }

    const userData = await response.json();
    return NextResponse.json(userData, { status: 200 });

  } catch (error) {
    console.error("Erro no Next API:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
