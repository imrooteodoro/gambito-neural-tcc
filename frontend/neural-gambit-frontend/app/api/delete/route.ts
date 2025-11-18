import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BACKEND_URL } from "../interface";

export async function DELETE() {
  try {
    const cookieStore = await cookies(); // agora é prometido
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token não encontrado" },
        { status: 401 }
      );
    }

    const backendRes = await fetch(`${BACKEND_URL}/signup/auth/delete_account`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!backendRes.ok) {
      const errText = await backendRes.text();
      console.error("Erro backend:", errText);
      return NextResponse.json(
        { error: "Erro no backend", backend: errText },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();

    return NextResponse.json(
      { message: "Conta deletada!", backend: data },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erro Next API:", error);
    return NextResponse.json(
      { error: "Erro interno no Next" },
      { status: 500 }
    );
  }
}
