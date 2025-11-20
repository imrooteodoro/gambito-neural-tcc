import { NextResponse } from "next/server";
import { BACKEND_URL } from "../../interface";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value ?? "";

    const raw = await req.text();
    let payload: any;
    try {
      payload = raw ? JSON.parse(raw) : {};
    } catch {
      payload = raw;
    }
    const game_pgn =
      typeof payload === "string"
        ? payload
        : payload?.game_pgn ?? payload;

    const response = await fetch(`${BACKEND_URL}/studies/studies/insert`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ game_pgn }),
    });

    if (!response.ok) {
      const backendError = await response.text();
      console.error("ERRO BACKEND:", backendError);
      return NextResponse.json(
        { error: "Erro no backend", backend: backendError },
        { status: response.status }
      );
    }

    const studies = await response.json();
    return NextResponse.json(studies, { status: 200 });
  } catch (error) {
    console.error("Erro no Next API:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}