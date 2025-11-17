import { NextResponse } from "next/server";
import { BACKEND_URL } from "../interface";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const body = await req.json();

    const { } = body;

    const backendRes = await fetch(`${BACKEND_URL}/signup/authdelete_account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({}),
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
      { message: "Conta deletada no backend!", backend: result },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erro no Next API:", error);
    return NextResponse.json(
      { error: "Erro interno no Next" },
      { status: 500 }
    );
  }
}   